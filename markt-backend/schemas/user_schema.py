from marshmallow import fields, Schema

class UserRegistrationSchema(Schema):
    full_name = fields.Str(required=True)
    password = fields.Str(required=True)
    email = fields.Str(required=True)
    phone = fields.Str(required=True)

class UserLoginSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True)

class UserUpdateSchema(Schema):
    verification_email = fields.Str(required=True)
    new_full_name = fields.Str(required=False)
    new_password = fields.Str(required=False)
    new_email = fields.Str(required=False)
    new_phone = fields.Str(required=False)
