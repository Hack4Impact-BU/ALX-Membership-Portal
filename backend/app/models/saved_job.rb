class SavedJob < ApplicationRecord
  belongs_to :job
  
  validates :user_id, presence: true
  validates :job_id, presence: true
  validates :job_id, uniqueness: { scope: :user_id, message: "has already been saved by this user" }
end 