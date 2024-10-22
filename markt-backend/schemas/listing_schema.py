from marshmallow import fields, Schema

class ListingInformationSchema(Schema):
    title = fields.Str(required=True)
    description = fields.Str(required=True)
    price = fields.Int(required=True)
    quantity = fields.Int(required=True)
    condition = fields.Str(required=True)
    seller_id = fields.Int(required=True)
