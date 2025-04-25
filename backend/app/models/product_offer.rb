class ProductOffer < ApplicationRecord
  # has_one_attached :pic # Seems like pic_url is used instead

  # Add association to saved product offers
  has_many :saved_product_offers, dependent: :destroy

  # Add validations if needed (example)
  # validates :offerTitle, :offerDesc, presence: true

  # Helper method to check if an offer is saved by a specific user
  def saved_by?(user_id)
    saved_product_offers.exists?(user_id: user_id)
  end

  # No validations for pic since it's optional
end
