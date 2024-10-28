from marshmallow import fields, Schema

class UserRegistrationSchema(Schema):
    utorid = fields.Str(required=True)
    password = fields.Str(required=True)
    email = fields.Str(required=True)
    phone = fields.Str(required=True)

class UserLoginSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True)
