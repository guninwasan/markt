from marshmallow import fields, Schema, validate

class ListingInformationSchema(Schema):
    # Backend specifications
    owner_email = fields.Str(required=True)

    # Essential details
    title = fields.Str(required=True)
    price = fields.Float(required=True, validate=validate.Range(min=0, max=10000))
    pickup_location = fields.Str(required=True)
    display_image = fields.Str(required=True)
    negotiable = fields.Bool(required=False, load_default=False)  # updated to match "negotiable" term
    condition = fields.Str(required=False)  # new field for item condition
    flairs = fields.List(fields.Str(), required=False)  # new field for product flairs
    media = fields.List(fields.Str(), required=False)  # updated to represent media files

    # Additional specifications (optional)
    description = fields.Str(required=False)
    quantity = fields.Int(required=False, validate=validate.Range(min=0, max=1000))
    brand = fields.Str(required=False)
    model = fields.Str(required=False)
    year_of_manufacture = fields.Int(required=False, validate=validate.Range(min=1900, max=2024))
    color = fields.Str(required=False)
    dimensions = fields.Str(required=False)
    weight = fields.Str(required=False)
    material = fields.Str(required=False)
    battery_life = fields.Str(required=False)
    storage_capacity = fields.Str(required=False)
    additional_details = fields.Str(required=False)  # added to match frontend

class ListingGetSchema(Schema):
    minimal = fields.Bool(required=False, load_default=True)

class ListingUpdate(Schema):
    # Backend specifications
    sold = fields.Bool(required=False, load_default=False)
    buyer_email = fields.Str(required=False)

    # Essential details
    title = fields.Str(required=False)
    price = fields.Float(required=False, validate=validate.Range(min=0, max=10000))
    pickup_location = fields.Str(required=False)
    display_image = fields.Str(required=False)
    negotiable = fields.Bool(required=False, load_default=False)  # updated to match "negotiable" term
    condition = fields.Str(required=False)  # added condition field
    flairs = fields.List(fields.Str(), required=False)  # added flairs field
    media = fields.List(fields.Str(), required=False)  # updated media field

    # Additional specifications (optional)
    description = fields.Str(required=False)
    quantity = fields.Int(required=False, validate=validate.Range(min=0, max=1000))
    brand = fields.Str(required=False)
    model = fields.Str(required=False)
    year_of_manufacture = fields.Int(required=False, validate=validate.Range(min=1900, max=2024))
    color = fields.Str(required=False)
    dimensions = fields.Str(required=False)
    weight = fields.Str(required=False)
    material = fields.Str(required=False)
    battery_life = fields.Str(required=False)
    storage_capacity = fields.Str(required=False)
    additional_details = fields.Str(required=False)

class ListingDeleteSchema(Schema):
    user_email = fields.Str(required=True, validate=validate.Email(error="Invalid email format"))
