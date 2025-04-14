class ProductOffer < ApplicationRecord
  has_one_attached :pic
  
  # No validations for pic since it's optional
end
