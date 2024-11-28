from flask_app.config.db_connection import connect
from dataclasses import asdict, is_dataclass, dataclass
from flask.json.provider import DefaultJSONProvider

class BaseModel:
    @staticmethod
    def format_data(delim: str, data: dict) -> str:
        return delim.join(f"{col}=%({col})s" for col in data)

    @classmethod
    def create(cls, **data: dict) -> int:
        query = f"""
                INSERT INTO {cls.table} ({', '.join(key for key in data)}) VALUES ({', '.join(f'%({key})s' for key in data)}) RETURNING id;
                """
        return connect().run_query(query, data)["id"]

    @classmethod
    def retrieve_one(cls, **data: dict):
        query = f"""
                SELECT * FROM {cls.table} WHERE {cls.format_data(" AND ", data)} LIMIT 1;
                """
        row = connect().run_query(query, data)
        if row:
            return cls(**row)

    @classmethod
    def retrieve_all(cls, **data: dict):
        query = f"""
                SELECT * FROM {cls.table}
                {"WHERE " + cls.format_data(" AND ", data) if data else ""};
                """
        rows = connect().run_query(query, data)
        return [cls(**row) for row in rows] if rows else []

    @classmethod
    def update(cls, id, **data: dict):
        query = f"""
                UPDATE {cls.table}
                SET {cls.format_data(", ", data)} 
                WHERE id=%(id)s;
                """
        data["id"] = id
        connect().run_query(query, data)

    @classmethod
    def delete(cls, **data: dict):
        query = f"""
                DELETE FROM {cls.table}
                WHERE {cls.format_data(" AND ", data)};
                """
        connect().run_query(query, data)

    def as_json(self, populate=[]):
        # populate is a list of properties (relationships) to be populated
        # example: populate=["owner", "members", "messages", "messages.sender"]
        json = asdict(self)
        rel_map = {}
        for rel in populate:
            rel, *sub = rel.split(".")
            rel_map[rel] = rel_map.get(rel, [])
            if sub:
                rel_map[rel].append(".".join(sub))

        for rel in rel_map:
            attr = getattr(self, rel)
            json[rel] = (
                attr.as_json(rel_map[rel])
                if is_dataclass(attr)
                else [x.as_json(rel_map[rel]) for x in attr]
            )
        return json

def Model(table_name):
    def inner(cls):
        cls.table = table_name
        cls = type(cls.__name__, (BaseModel, cls), dict(cls.__dict__))
        
        def post_init(self):
            self.update = lambda **data: self.__class__.update(id=self.id,**data)
            self.delete = lambda **data: self.__class__.delete(id=self.id,**data)
        
        cls.__post_init__ = post_init

        cls = dataclass(cls)

        return cls
    return inner


class ModelProvider(DefaultJSONProvider):
    @staticmethod
    def default(obj):
        # automatically convert models into json when passing them into jsonify
        if isinstance(obj, BaseModel):
            return obj.as_json()
        else:
            return DefaultJSONProvider.default(obj)