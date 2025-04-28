class Eventlist < ApplicationRecord
  # ... existing code ...
  
  # Add this line to enable image attachment
  has_one_attached :image
  
  # Add association to saved events
  has_many :saved_events, dependent: :destroy

  # Add validations if needed (example)
  # validates :eventName, :eventDesc, :startDate, :endDate, presence: true

  # Helper method to check if an event is saved by a specific user
  def saved_by?(user_id)
    saved_events.exists?(user_id: user_id)
  end

end