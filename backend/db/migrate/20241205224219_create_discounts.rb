class CreateDiscounts < ActiveRecord::Migration[7.2]
  def change
    create_table :discounts do |t|
      t.string :title
      t.string :location
      t.boolean :is_saved
      t.string :offer_description
      t.string :redeem_desc
      t.date :date

      t.timestamps
    end
  end
end
