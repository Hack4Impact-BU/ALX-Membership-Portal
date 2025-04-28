class CreateSavedProductOffers < ActiveRecord::Migration[7.2]
  def change
    create_table :saved_product_offers do |t|
      t.string :user_id, null: false
      t.references :product_offer, null: false, foreign_key: true

      t.timestamps

      # Add unique index to prevent duplicate saves
      t.index [:user_id, :product_offer_id], unique: true, name: 'index_saved_product_offers_on_user_and_product'
    end
  end
end
