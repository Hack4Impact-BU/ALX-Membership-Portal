json.extract!(user,
    :id, 
    :created_at, 
    :updated_at,
    :name,
    :email, 
)
json.url v1_user_url(user, format: :json)
