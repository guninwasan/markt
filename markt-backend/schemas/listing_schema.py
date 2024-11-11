from marshmallow import fields, Schema, validate

class ListingInformationSchema(Schema):
    owner_email = fields.Str(required=True)
    title = fields.Str(required=True)
    description = fields.Str(required=True)
    price = fields.Float(required=True, validate=validate.Range(min=0, max=10000))
    display_image = fields.Str(required=True)
    negotiable = fields.Bool(required=False, load_default=False)
    condition = fields.Str(required=False)
    flairs = fields.List(fields.Str(), required=False)
    media = fields.List(fields.Str(), required=False)
    brand = fields.Str(required=False)
    model = fields.Str(required=False)
    year_of_manufacture = fields.Int(required=False, validate=validate.Range(min=1900, max=2024))  # Ensure consistent naming
    color = fields.Str(required=False)
    dimensions = fields.Str(required=False)
    weight = fields.Str(required=False)
    material = fields.Str(required=False)
    battery_life = fields.Str(required=False)  # Ensure consistent naming
    storage_capacity = fields.Str(required=False)  # Ensure consistent naming
    additional_features = fields.Str(required=False)  # Ensure consistent naming
    additional_details = fields.Str(required=False)  # Ensure consistent naming

class ListingGetSchema(Schema):
    minimal = fields.Bool(required=False, load_default=True)

class ListingUpdate(Schema):
    # Fields to update for a listing
    title = fields.Str(required=False)
    description = fields.Str(required=False)
    price = fields.Float(required=False, validate=validate.Range(min=0, max=10000))
    display_image = fields.Str(required=False)
    
    negotiable = fields.Bool(required=False, load_default=False)
    condition = fields.Str(required=False)
    flairs = fields.List(fields.Str(), required=False)
    media = fields.List(fields.Str(), required=False)
    brand = fields.Str(required=False)
    model = fields.Str(required=False)
    yearOfManufacture = fields.Int(required=False, validate=validate.Range(min=1900, max=2024))
    color = fields.Str(required=False)
    dimensions = fields.Str(required=False)
    weight = fields.Str(required=False)
    material = fields.Str(required=False)
    batteryLife = fields.Str(required=False)
    storageCapacity = fields.Str(required=False)
    additionalFeatures = fields.Str(required=False)
    additionalDetails = fields.Str(required=False)

    # Backend specifications
    sold = fields.Bool(required=False, load_default=False)
    buyer_email = fields.Str(required=False)

class ListingDeleteSchema(Schema):
    user_email = fields.Str(required=True, validate=validate.Email(error="Invalid email format"))
