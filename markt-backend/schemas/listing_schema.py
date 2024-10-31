from marshmallow import fields, Schema, validate

class ListingInformationSchema(Schema):
    title = fields.Str(required=True)
    description = fields.Str(required=True)
    price = fields.Float(required=True, validate=validate.Range(min=0, max=10000))
    quantity = fields.Int(required=True)
    sold = fields.Bool(load_default=False)
    condition = fields.Str(required=True)
    owner_id = fields.Int(required=True)

class ListingUpdate(Schema):
    title = fields.Str(required=False)
    description = fields.Str(required=False)
    price = fields.Float(required=False, validate=validate.Range(min=0, max=10000))
    quantity = fields.Int(required=False)
    sold = fields.Bool(required=False, load_default=False)
    condition = fields.Str(required=False)
    owner_id = fields.Int(required=False)
