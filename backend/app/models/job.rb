class Job < ApplicationRecord
    has_one_attached :logo
  
    validates :title, :company, :description, :responsibilities, :requirements, :salary, :contact, :location, :job_type, presence: true
  end