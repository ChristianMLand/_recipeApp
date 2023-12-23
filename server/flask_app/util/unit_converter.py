from collections import deque
from fractions import Fraction
from unicodedata import numeric

def parse_facts(facts):
    unit_graph = {}
    for from_unit, multiplier, to_unit in facts:
        unit_graph[from_unit] = unit_graph.get(from_unit, [])
        unit_graph[from_unit].append((multiplier, to_unit))
        unit_graph[to_unit] = unit_graph.get(to_unit, [])
        unit_graph[to_unit].append((1 / multiplier, from_unit))
    return unit_graph

def try_convert(query, facts):
    unit_graph = parse_facts(facts)
    initial_value, initial_unit, target_unit = query
    queue = deque([(initial_value, initial_unit)])
    visited = set([initial_unit])
    while len(queue) > 0:
        current_value, current_unit = queue.popleft()
        if current_unit == target_unit:
            return current_value
        for multiplier, unit in unit_graph[current_unit]:
            if unit in visited:
                continue
            queue.append((current_value * multiplier, unit))
            visited.add(unit)
    return "not convertible!"


unit_dict = {
    "pounds": "lbs",
    "pound": "lbs",
    "teaspoons": "tsp",
    "teaspoon": "tsp",
    "tablespoons": "tbsp",
    "tablespoon": "tbsp",
    # other unit conversions here
}
unicode_fractions = [
    "↉", 
    "⅟", 
    "⅒", 
    "½", 
    "⅓", 
    "¼", 
    "⅕", 
    "⅙", 
    "⅐", 
    "⅛", 
    "⅑", 
    "⅔", 
    "⅖", 
    "¾", 
    "⅗",
    "⅜",
    "⅘",
    "⅚",
    "⅝", 
    "⅞"
]
def standardize_units(ingredient):
    output = []
    ingredient = ingredient.replace("–", "-").replace("-", " - ")
    for part in ingredient.split(" "):
        if part[0].isdigit():
            if part[-1] in unicode_fractions:
                output.append((Fraction(part[:-1]) + Fraction(numeric(part[-1]))).limit_denominator())
            else:
                output.append(Fraction(part).limit_denominator())
        elif part in unicode_fractions:
            output.append(Fraction(numeric(part)).limit_denominator())
        else:
            output.append(part)
    real_output = []
    for i, part in enumerate(output):
        if type(part) is Fraction:
            if i > 0 and type(output[i-1]) is Fraction:
                continue
            elif i <= len(output)-2 and type(output[i+1]) is Fraction:
                real_output.append(f"{part + output[i+1]}")
            else:
                quotient = part.numerator // part.denominator
                remainder = part.numerator % part.denominator
                if quotient == 0 and remainder == 0:
                    real_output.append("1")
                else:
                    real_output.append(f"{part}")
        elif type(part) is str:
            if part in unit_dict:
                real_output.append(unit_dict[part])
            else:
                real_output.append(part)
    return " ".join(real_output)

if __name__ == "__main__":
    example_facts = [
        ("cup", 16, "tbsp"),
        ("tbsp", 3, "tsp"),
    ]

    # print(answer_query((2, "m", "in"), example_facts), 78.72)
    # print(answer_query((13, "in", "m"), example_facts), 0.330)
    # print(answer_query((13, "in", "hr"), example_facts), "not convertible!")
    # print(answer_query((1, "hr", "sec"), example_facts), 3600)