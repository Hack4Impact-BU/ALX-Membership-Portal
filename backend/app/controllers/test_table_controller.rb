class TestTableController < ApplicationController
    def index
        @test_tables = TestTable.all
        render json: @test_tables
    end
end
