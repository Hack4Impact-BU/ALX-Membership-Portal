class CreateBenefitsDiscounts < ActiveRecord::Migration[7.2]
  def change
    create_table :benefits_discounts do |t|
      t.string :title          # Title or discount information (e.g., "20% off")
      t.string :location       # Location (e.g., "Museum of Fine Arts")
      t.date :start_date       # Start date of the discount
      t.date :end_date         # End date of the discount
      t.text :offer_description # Description of the offer

      t.timestamps             # Adds created_at and updated_at columns
    end
  end
end
