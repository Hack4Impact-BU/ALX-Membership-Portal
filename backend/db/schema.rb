# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_04_25_150526) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "eventlists", force: :cascade do |t|
    t.string "eventType"
    t.date "startDate"
    t.date "endDate"
    t.string "location"
    t.string "org"
    t.time "timeStart"
    t.time "timeEnd"
    t.string "eventName"
    t.boolean "isSaved"
    t.text "eventDesc"
    t.text "instruct"
    t.string "pic"
    t.string "phone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "get_involveds", force: :cascade do |t|
    t.string "title"
    t.text "summary"
    t.text "description"
    t.date "date"
    t.string "time"
    t.string "location"
    t.string "phone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "jobs", force: :cascade do |t|
    t.string "title"
    t.string "company"
    t.text "description"
    t.text "responsibilities"
    t.text "requirements"
    t.string "salary"
    t.string "contact"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "location"
    t.string "job_type"
    t.boolean "is_saved"
  end

  create_table "product_offers", force: :cascade do |t|
    t.string "place"
    t.string "offerTitle"
    t.text "offerDesc"
    t.text "instruct"
    t.boolean "isSaved"
    t.date "startDate"
    t.date "endDate"
    t.string "businessType"
    t.string "pic_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "q_and_as", force: :cascade do |t|
    t.string "question"
    t.string "answer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "researches", force: :cascade do |t|
    t.string "researchTitle"
    t.text "researchDesc"
    t.string "link"
    t.date "date"
    t.string "location"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "saved_events", force: :cascade do |t|
    t.string "user_id", null: false
    t.bigint "eventlist_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["eventlist_id"], name: "index_saved_events_on_eventlist_id"
    t.index ["user_id", "eventlist_id"], name: "index_saved_events_on_user_id_and_eventlist_id", unique: true
  end

  create_table "saved_jobs", force: :cascade do |t|
    t.string "user_id", null: false
    t.bigint "job_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_saved_jobs_on_job_id"
    t.index ["user_id", "job_id"], name: "index_saved_jobs_on_user_id_and_job_id", unique: true
  end

  create_table "saved_product_offers", force: :cascade do |t|
    t.string "user_id", null: false
    t.bigint "product_offer_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_offer_id"], name: "index_saved_product_offers_on_product_offer_id"
    t.index ["user_id", "product_offer_id"], name: "index_saved_product_offers_on_user_and_product", unique: true
  end

  create_table "trainings", force: :cascade do |t|
    t.string "trainingTitle"
    t.text "trainingDesc"
    t.string "link"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "saved_events", "eventlists"
  add_foreign_key "saved_jobs", "jobs"
  add_foreign_key "saved_product_offers", "product_offers"
end
