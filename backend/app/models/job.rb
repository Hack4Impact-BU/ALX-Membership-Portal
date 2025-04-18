class Job < ApplicationRecord
    has_one_attached :logo
    has_many :saved_jobs, dependent: :destroy
  
    validates :title, :company, :description, :responsibilities, :requirements, :salary, :contact, :location, :job_type, presence: true
  
    def saved_by?(user_id)
      saved_jobs.exists?(user_id: user_id)
    end
  end