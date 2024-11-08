from marshmallow import fields, Schema

class UserRegistrationSchema(Schema):
    full_name = fields.Str(required=True)
    password = fields.Str(required=True)
    email = fields.Str(required=True)
    phone = fields.Int(required=True)

class UserLoginSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True)

class UserUpdateSchema(Schema):
    full_name = fields.Str(required=False)
    password = fields.Str(required=False)
    email = fields.Str(required=False)
    phone = fields.Int(required=False)
    rating = fields.Float(required=False)

class UserChangePasswordSchema(Schema):
    current_password = fields.Str(required=True)
    new_password = fields.Str(required=True)

class AddInterestSchema(Schema):
    listing_ids = fields.List(fields.Int(), required=True)

class GetListingsSchema(Schema):
    get_unsold = fields.Bool(required=False, load_default=False)
    get_sold = fields.Bool(required=False, load_default=False)
    get_interested = fields.Bool(required=False, load_default=False)
    get_bought = fields.Bool(required=False, load_default=False)
