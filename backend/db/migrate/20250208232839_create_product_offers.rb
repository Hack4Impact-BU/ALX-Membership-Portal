class CreateProductOffers < ActiveRecord::Migration[7.2]
  def change
    create_table :product_offers do |t|
      t.string :place
      t.string :offerTitle
      t.text :offerDesc
      t.text :instruct
      t.boolean :isSaved
      t.date :startDate
      t.date :endDate
      t.string :businessType
      t.string :pic
      
      t.timestamps
    end
  end
end
