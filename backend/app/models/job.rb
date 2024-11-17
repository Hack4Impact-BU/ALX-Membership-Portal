class Job < ApplicationRecord
    has_one_attached :logo
  
    validates :title, :company, :description, :responsibilities, :requirements, :salary, :contact, presence: true
  end