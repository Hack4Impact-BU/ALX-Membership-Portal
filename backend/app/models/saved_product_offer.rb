class SavedProductOffer < ApplicationRecord
  belongs_to :product_offer

  # Use the user_id (string) from Auth0 directly
  validates :user_id, presence: true
  validates :product_offer_id, presence: true

  # Ensure a user can save an offer only once
  validates :product_offer_id, uniqueness: { scope: :user_id, message: "has already been saved by this user" }
end 