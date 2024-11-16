class AddBusinessTypeToBenefitsDiscounts < ActiveRecord::Migration[7.2]
  def change
    add_column :benefits_discounts, :business_type, :string
  end
end
