class ForceRenamePicToPicUrl < ActiveRecord::Migration[7.2]
  def change
    # Check if the 'pic' column exists and 'pic_url' does not, to avoid errors if run twice
    if column_exists?(:product_offers, :pic) && !column_exists?(:product_offers, :pic_url)
      rename_column :product_offers, :pic, :pic_url
      puts "Forcing rename of 'pic' to 'pic_url' to match expected schema state."
    else
      puts "Column 'pic_url' already exists or 'pic' column missing. No rename needed."
    end
  end
end