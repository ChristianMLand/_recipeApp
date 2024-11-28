from . import standardize_units


def convert_to_list(obj, key):
    filtered = filter(lambda x: x, obj[key].splitlines())
    if key == "ingredients":
        filtered = map(standardize_units, filtered)
    return list(filtered)