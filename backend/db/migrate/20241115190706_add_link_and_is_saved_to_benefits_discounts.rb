class AddLinkAndIsSavedToBenefitsDiscounts < ActiveRecord::Migration[7.2]
  def change
    add_column :benefits_discounts, :link, :string
    add_column :benefits_discounts, :is_saved, :boolean, default: false, null: false
  end
end
