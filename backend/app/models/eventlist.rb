class Eventlist < ApplicationRecord
  # ... existing code ...
  
  # Add this line to enable image attachment
  has_one_attached :image
  
end