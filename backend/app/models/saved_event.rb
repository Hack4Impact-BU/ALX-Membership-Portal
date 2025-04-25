class SavedEvent < ApplicationRecord
  belongs_to :eventlist

  # Use the user_id (string) from Auth0 directly
  validates :user_id, presence: true
  validates :eventlist_id, presence: true

  # Ensure a user can save an event only once
  validates :eventlist_id, uniqueness: { scope: :user_id, message: "has already been saved by this user" }
end 