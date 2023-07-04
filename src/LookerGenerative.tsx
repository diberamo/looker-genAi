// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useContext, useEffect, useState , FormEvent, useCallback, ReactElement} from 'react'
import { Button, ComponentsProvider, FieldTextArea, Space, Span, SpaceVertical} from '@looker/components'
import { ExtensionContext , ExtensionContextData} from '@looker/extension-sdk-react'
import { type ILook, IRequestAllLookmlModels, ILookmlModel , ISqlQueryCreate, ILookmlModelExploreFieldset,ILookmlModelExploreField, ISqlQuery, query, } from '@looker/sdk'
import { ExploreList } from './ExploreList'
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'
import { MessageBar, Box, Heading } from '@looker/components'
import { ISDKSuccessResponse } from '@looker/sdk-rtl'
import { EmbedContainer } from './EmbedContainer'
import { LookerEmbedExplore , LookerEmbedSDK} from '@looker/embed-sdk'



/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const LookerGenerative: React.FC = () => {
  const { core40SDK } =  useContext(ExtensionContext)
  const [message, setMessage] = useState('')
  const [loadingLookerModels, setLoadingLookerModels] = useState<boolean>(false)
  const [lookerModels, setLookerModels] = useState<ILookmlModel[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()
  const match = useRouteMatch<{ lookid: string }>('/:lookid')
  const [currentLookerModel, setCurrentLookerModel] = useState<ILookmlModel>()
  const [currentExploreName, setCurrentExploreName] = useState<string>("wiki100_m")
  const [prompt, setPrompt] = useState<string>()
  const [currentExploreId, setCurrentExploreId] = useState<string>()  
  const [exploreDivElement, setExploreDivElement] = useState<HTMLDivElement>()
  const [hostUrl, setHostUrl] = useState<string>()


  useEffect(() => {
    const getMe = async () => {
      try {
        const me = await core40SDK.ok(core40SDK.me())
        setMessage(`Hello, ${me.display_name}`)
      } catch (error) {
        console.error(error)
        setMessage('An error occurred while getting information about me!')
      }
    }
    getMe()
  }, [])

  useEffect(() => {
    loadExplores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadExplores = async () => {
    setLoadingLookerModels(true);
    setErrorMessage(undefined);
    try {
      const req: IRequestAllLookmlModels = {
      }
      const result = await core40SDK.ok(core40SDK.all_lookml_models(req))
      setLookerModels(result.slice(0,100));
      setLoadingLookerModels(false);
    } catch (error) {
      setLoadingLookerModels(false)
      setErrorMessage('Error loading looks')
    }
  }

  const selectModel = (lookerModel: ILookmlModel) => {
    setCurrentLookerModel(lookerModel);
  }

  const selectCurrentExploreName = (exploreName: string) => {
    setCurrentExploreName(exploreName);
  }

  // selectModel(lookml);
  // selectCurrentExplore(explore.name!);
  
  
  const handleClear = () => {

    setPrompt('Default Prompt');    
    exploreDivElement?.removeChild(exploreDivElement.firstChild!);

  }
  const handleChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setPrompt(e.currentTarget.value)
  }

  const generatePrompt = (jsonPayloadLookMLExplore: string, modelName: string, viewName: string) => {

    const generatedPrompt2 = `
    Write a simple JSON body output with the following rules.
    Use the following data dictionary in order to search the relevant fields, filters sorts and pivots. 
    Always return model : ${modelName} and view: "${viewName}".
    Field dictionary : ${jsonPayloadLookMLExplore}
    Make sure to only use the fields in the field dictionary.
    Input: ${prompt}
    Output: {"model": ${modelName}, "view": ${viewName}, "fields": ["field1", "field2"], "filters": {"order_items.created_date": "last week"}, "sorts": ["order_items.total_sale_price desc"], "pivots": null, "limit": "10"}
    `

    const generatedPrompt = `
    Write a simple JSON body output with the following rules.
    Use the following data dictionary in order to search the relevant fields, filters sorts and pivots. 
    Always return model : ${modelName} and view: "${viewName}".
    Field dictionary : ${jsonPayloadLookMLExplore}
    Make sure to only use the fields in the field dictionary.
    Input: ${prompt}

    Here are some generic examples that uses this another different dictionary, so you can learn how it works:
    example_dictionary = [{"label": "Discounts Date Date", "field": "discounts.date_date", "description": ""}, {"label": "Discounts Date Day of Month", "field": "discounts.date_day_of_month", "description": ""}, {"label": "Discounts Date Day of Week", "field": "discounts.date_day_of_week", "description": ""}, {"label": "Discounts Date Day of Week Index", "field": "discounts.date_day_of_week_index", "description": ""}, {"label": "Discounts Date Day of Year", "field": "discounts.date_day_of_year", "description": ""}, {"label": "Discounts Date Hour", "field": "discounts.date_hour", "description": ""}, {"label": "Discounts Date Hour of Day", "field": "discounts.date_hour_of_day", "description": ""}, {"label": "Discounts Date Minute", "field": "discounts.date_minute", "description": ""}, {"label": "Discounts Date Month", "field": "discounts.date_month", "description": ""}, {"label": "Discounts Date Month Name", "field": "discounts.date_month_name", "description": ""}, {"label": "Discounts Date Month Num", "field": "discounts.date_month_num", "description": ""}, {"label": "Discounts Date Quarter", "field": "discounts.date_quarter", "description": ""}, {"label": "Discounts Date Quarter of Year", "field": "discounts.date_quarter_of_year", "description": ""}, {"label": "Discounts Date Raw", "field": "discounts.date_raw", "description": ""}, {"label": "Discounts Date Time", "field": "discounts.date_time", "description": ""}, {"label": "Discounts Date Time of Day", "field": "discounts.date_time_of_day", "description": ""}, {"label": "Discounts Date Week", "field": "discounts.date_week", "description": ""}, {"label": "Discounts Date Week of Year", "field": "discounts.date_week_of_year", "description": ""}, {"label": "Discounts Date Year", "field": "discounts.date_year", "description": ""}, {"label": "Discounts Discount Amount", "field": "discounts.discount_amount", "description": ""}, {"label": "Discounts Discount Price", "field": "discounts.discount_price", "description": ""}, {"label": "Discounts Inventory Item ID", "field": "discounts.inventory_item_id", "description": ""}, {"label": "Discounts Pk", "field": "discounts.pk", "description": ""}, {"label": "Discounts Product ID", "field": "discounts.product_id", "description": ""}, {"label": "Discounts Retail Price", "field": "discounts.retail_price", "description": ""}, {"label": "Distribution Center ID", "field": "distribution_centers.id", "description": ""}, {"label": "Distribution Center Latitude", "field": "distribution_centers.latitude", "description": ""}, {"label": "Distribution Center Location", "field": "distribution_centers.location", "description": ""}, {"label": "Distribution Center Longitude", "field": "distribution_centers.longitude", "description": ""}, {"label": "Distribution Center Name", "field": "distribution_centers.name", "description": ""}, {"label": "Inventory Items Cost", "field": "inventory_items.cost", "description": ""}, {"label": "Inventory Items Created", "field": "inventory_items.created_time", "description": ""}, {"label": "Inventory Items Created", "field": "inventory_items.created_date", "description": ""}, {"label": "Inventory Items Created", "field": "inventory_items.created_week", "description": ""}, {"label": "Inventory Items Created", "field": "inventory_items.created_month", "description": ""}, {"label": "Inventory Items Created", "field": "inventory_items.created_raw", "description": ""}, {"label": "Inventory Items Days In Inventory Tier", "field": "inventory_items.days_in_inventory_tier", "description": ""}, {"label": "Inventory Items Days Since Arrival", "field": "inventory_items.days_since_arrival", "description": "days since created - useful when filtering on sold yesno for items still in inventory"}, {"label": "Inventory Items Days Since Arrival Tier", "field": "inventory_items.days_since_arrival_tier", "description": ""}, {"label": "Inventory Items Days in Inventory", "field": "inventory_items.days_in_inventory", "description": "days between created and sold date"}, {"label": "Inventory Items ID", "field": "inventory_items.id", "description": ""}, {"label": "Inventory Items Is Sold (Yes / No)", "field": "inventory_items.is_sold", "description": ""}, {"label": "Inventory Items Product Distribution Center ID", "field": "inventory_items.product_distribution_center_id", "description": ""}, {"label": "Inventory Items Product ID", "field": "inventory_items.product_id", "description": ""}, {"label": "Inventory Items Sold", "field": "inventory_items.sold_time", "description": ""}, {"label": "Inventory Items Sold", "field": "inventory_items.sold_date", "description": ""}, {"label": "Inventory Items Sold", "field": "inventory_items.sold_week", "description": ""}, {"label": "Inventory Items Sold", "field": "inventory_items.sold_month", "description": ""}, {"label": "Inventory Items Sold", "field": "inventory_items.sold_raw", "description": ""}, {"label": "Order Items Created Date", "field": "order_items.created_date", "description": ""}, {"label": "Order Items Created Day of Week", "field": "order_items.created_day_of_week", "description": ""}, {"label": "Order Items Created Hour", "field": "order_items.created_hour", "description": ""}, {"label": "Order Items Created Hour of Day", "field": "order_items.created_hour_of_day", "description": ""}, {"label": "Order Items Created Month", "field": "order_items.created_month", "description": ""}, {"label": "Order Items Created Month Name", "field": "order_items.created_month_name", "description": ""}, {"label": "Order Items Created Month Num", "field": "order_items.created_month_num", "description": ""}, {"label": "Order Items Created Raw", "field": "order_items.created_raw", "description": ""}, {"label": "Order Items Created Time", "field": "order_items.created_time", "description": ""}, {"label": "Order Items Created Week", "field": "order_items.created_week", "description": ""}, {"label": "Order Items Created Week of Year", "field": "order_items.created_week_of_year", "description": ""}, {"label": "Order Items Created Year", "field": "order_items.created_year", "description": ""}, {"label": "Order Items Days Since Sold", "field": "order_items.days_since_sold", "description": ""}, {"label": "Order Items Days to Process", "field": "order_items.days_to_process", "description": ""}, {"label": "Order Items Delivered Date", "field": "order_items.delivered_date", "description": ""}, {"label": "Order Items Delivered Month", "field": "order_items.delivered_month", "description": ""}, {"label": "Order Items Delivered Raw", "field": "order_items.delivered_raw", "description": ""}, {"label": "Order Items Delivered Week", "field": "order_items.delivered_week", "description": ""}, {"label": "Order Items Gross Margin", "field": "order_items.gross_margin", "description": ""}, {"label": "Order Items ID", "field": "order_items.id", "description": ""}, {"label": "Order Items Inventory Item ID", "field": "order_items.inventory_item_id", "description": ""}, {"label": "Order Items Is Returned (Yes / No)", "field": "order_items.is_returned", "description": ""}, {"label": "Order Items Item Gross Margin Percentage", "field": "order_items.item_gross_margin_percentage", "description": ""}, {"label": "Order Items Item Gross Margin Percentage Tier", "field": "order_items.item_gross_margin_percentage_tier", "description": ""}, {"label": "Order Items Order ID", "field": "order_items.order_id", "description": ""}, {"label": "Order Items Order ID No Actions", "field": "order_items.order_id_no_actions", "description": ""}, {"label": "Order Items Repeat Orders within 15 Days (Yes / No)", "field": "order_items.repeat_orders_within_15d", "description": ""},, {"label": "Order Items Returned Date", "field": "order_items.returned_date", "description": ""}, {"label": "Order Items Returned Month", "field": "order_items.returned_month", "description": ""}, {"label": "Order Items Returned Raw", "field": "order_items.returned_raw", "description": ""}, {"label": "Order Items Returned Time", "field": "order_items.returned_time", "description": ""}, {"label": "Order Items Returned Week", "field": "order_items.returned_week", "description": ""}, {"label": "Order Items Sale Price", "field": "order_items.sale_price", "description": ""}, {"label": "Order Items Shipped Date", "field": "order_items.shipped_date", "description": ""}, {"label": "Order Items Shipped Month", "field": "order_items.shipped_month", "description": ""}, {"label": "Order Items Shipped Raw", "field": "order_items.shipped_raw", "description": ""}, {"label": "Order Items Shipped Week", "field": "order_items.shipped_week", "description": ""}, {"label": "Order Items Shipping Time", "field": "order_items.shipping_time", "description": ""}, {"label": "Order Items Status", "field": "order_items.status", "description": ""}, {"label": "Order Items User Id", "field": "order_items.user_id", "description": ""}, {"label": "Orders Is First Purchase (Yes / No)", "field": "order_facts.is_first_purchase", "description": ""}, {"label": "Orders Items in Order", "field": "order_facts.items_in_order", "description": ""}, {"label": "Orders Months Since Signup", "field": "order_items.months_since_signup", "description": ""}, {"label": "Orders Order Amount", "field": "order_facts.order_amount", "description": ""}, {"label": "Orders Order Cost", "field": "order_facts.order_cost", "description": ""}, {"label": "Orders Order Gross Margin", "field": "order_facts.order_gross_margin", "description": ""}, {"label": "Orders Order ID", "field": "order_facts.order_id", "description": ""}, {"label": "Orders Order Sequence Number", "field": "order_facts.order_sequence_number", "description": ""}, {"label": "Products Brand", "field": "products.brand", "description": ""}, {"label": "Products Category", "field": "products.category", "description": ""}, {"label": "Products Department", "field": "products.department", "description": ""}, {"label": "Products Distribution Center ID", "field": "products.distribution_center_id", "description": ""}, {"label": "Products ID", "field": "products.id", "description": ""}, {"label": "Products Item Name", "field": "products.item_name", "description": ""}, {"label": "Products Retail Price", "field": "products.retail_price", "description": ""}, {"label": "Products SKU", "field": "products.sku", "description": ""}, {"label": "Repeat Purchase Facts Days Until Next Order", "field": "order_items.days_until_next_order", "description": ""}, {"label": "Repeat Purchase Facts Has Subsequent Order (Yes / No)", "field": "repeat_purchase_facts.has_subsequent_order", "description": ""}, {"label": "Repeat Purchase Facts Next Order", "field": "repeat_purchase_facts.next_order_raw", "description": ""}, {"label": "Repeat Purchase Facts Next Order", "field": "repeat_purchase_facts.next_order_date", "description": ""}, {"label": "Repeat Purchase Facts Next Order ID", "field": "repeat_purchase_facts.next_order_id", "description": ""}, {"label": "Repeat Purchase Facts Number Subsequent Orders", "field": "repeat_purchase_facts.number_subsequent_orders", "description": ""}, {"label": "Repeat Purchase Facts Order ID", "field": "repeat_purchase_facts.order_id", "description": ""}, {"label": "Repeat Purchase Facts Repeat Orders within 30 Days (Yes / No)", "field": "order_items.repeat_orders_within_30d", "description": ""}, {"label": "Users Age", "field": "users.age", "description": ""}, {"label": "Users Age Tier", "field": "users.age_tier", "description": ""}, {"label": "Users Approx Latitude", "field": "users.approx_latitude", "description": ""}, {"label": "Users Approx Location", "field": "users.approx_location", "description": ""}, {"label": "Users Approx Longitude", "field": "users.approx_longitude", "description": ""}, {"label": "Users City", "field": "users.city", "description": ""}, {"label": "Users Country", "field": "users.country", "description": ""}, {"label": "Users Created", "field": "users.created_date", "description": ""}, {"label": "Users Created", "field": "users.created_day_of_month", "description": ""}, {"label": "Users Created", "field": "users.created_day_of_week", "description": ""}, {"label": "Users Created", "field": "users.created_day_of_week_index", "description": ""}, {"label": "Users Created", "field": "users.created_day_of_year", "description": ""}, {"label": "Users Created", "field": "users.created_hour", "description": ""}, {"label": "Users Created", "field": "users.created_hour_of_day", "description": ""}, {"label": "Users Created", "field": "users.created_minute", "description": ""}, {"label": "Users Created", "field": "users.created_month", "description": ""}, {"label": "Users Created", "field": "users.created_month_num", "description": ""}, {"label": "Users Created", "field": "users.created_month_name", "description": ""}, {"label": "Users Created", "field": "users.created_quarter", "description": ""}, {"label": "Users Created", "field": "users.created_quarter_of_year", "description": ""}, {"label": "Users Created", "field": "users.created_raw", "description": ""}, {"label": "Users Created", "field": "users.created_time", "description": ""}, {"label": "Users Created", "field": "users.created_time_of_day", "description": ""}, {"label": "Users Created", "field": "users.created_week", "description": ""}, {"label": "Users Created", "field": "users.created_week_of_year", "description": ""}, {"label": "Users Created", "field": "users.created_year", "description": ""}, {"label": "Users Email", "field": "users.email", "description": ""}, {"label": "Users Facts Currently Active Customer (Yes / No)", "field": "user_order_facts.currently_active_customer", "description": ""}, {"label": "Users Facts Days As Customer", "field": "user_order_facts.days_as_customer", "description": "Days between first and latest order"}, {"label": "Users Facts Days as Customer Tiered", "field": "user_order_facts.days_as_customer_tiered", "description": ""}, {"label": "Users Facts Distinct Months with Orders", "field": "user_order_facts.distinct_months_with_orders", "description": ""}, {"label": "Users Facts First Order", "field": "user_order_facts.first_order_date", "description": ""}, {"label": "Users Facts First Order", "field": "user_order_facts.first_order_week", "description": ""}, {"label": "Users Facts First Order", "field": "user_order_facts.first_order_month", "description": ""}, {"label": "Users Facts First Order", "field": "user_order_facts.first_order_year", "description": ""}, {"label": "Users Facts Latest Orders", "field": "user_order_facts.latest_order_date", "description": ""}, {"label": "Users Facts Latest Orders", "field": "user_order_facts.latest_order_week", "description": ""}, {"label": "Users Facts Latest Orders", "field": "user_order_facts.latest_order_month", "description": ""}, {"label": "Users Facts Latest Orders", "field": "user_order_facts.latest_order_year", "description": ""}, {"label": "Users Facts Lifetime Orders", "field": "user_order_facts.lifetime_orders", "description": ""}, {"label": "Users Facts Lifetime Orders Tier", "field": "user_order_facts.lifetime_orders_tier", "description": ""}, {"label": "Users Facts Lifetime Reveneue Tier", "field": "user_order_facts.lifetime_revenue_tier", "description": ""}, {"label": "Users Facts Lifetime Revenue", "field": "user_order_facts.lifetime_revenue", "description": ""}, {"label": "Users Facts Repeat Customer (Yes / No)", "field": "user_order_facts.repeat_customer", "description": "Lifetime Count of Orders > 1"}, {"label": "Users Facts User ID", "field": "user_order_facts.user_id", "description": ""}, {"label": "Users First Name", "field": "users.first_name", "description": ""}, {"label": "Users Gender", "field": "users.gender", "description": ""}, {"label": "Users Gender Short", "field": "users.gender_short", "description": ""}, {"label": "Users History", "field": "users.history", "description": ""}, {"label": "Users ID", "field": "users.id", "description": ""}, {"label": "Users Image File", "field": "users.image_file", "description": ""}, {"label": "Users Last Name", "field": "users.last_name", "description": ""}, {"label": "Users Location", "field": "users.location", "description": ""}, {"label": "Users Name", "field": "users.name", "description": ""}, {"label": "Users Over 21 (Yes / No)", "field": "users.over_21", "description": ""}, {"label": "Users SSN", "field": "users.ssn", "description": ""}, {"label": "Users SSN Last 4", "field": "users.ssn_last_4", "description": "Only users with sufficient permissions will see this data"}, {"label": "Users State", "field": "users.state", "description": ""}, {"label": "Users Traffic Source", "field": "users.traffic_source", "description": ""}, {"label": "Users UK Postcode", "field": "users.uk_postcode", "description": ""}, {"label": "Users User Image", "field": "users.user_image", "description": ""}, {"label": "Users Zip", "field": "users.zip", "description": ""}, {"label": "High Value Geos", "field": "turtle::high_value_geos", "description": ""}, {"label": "Inventory Aging", "field": "turtle::inventory_aging", "description": ""}, {"label": "Severely Delayed Orders", "field": "turtle::severely_delayed_orders", "description": ""}, {"label": "Shipments Status", "field": "turtle::shipments_status", "description": ""}, {"label": "Year Over Year", "field": "turtle::year_over_year", "description": ""}, {"label": "Discounts Average Discount", "field": "discounts.average_discount", "description": ""}, {"label": "Discounts Count", "field": "discounts.count", "description": ""}, {"label": "Distribution Center Location Latitude Max", "field": "distribution_centers.location_latitude_max", "description": ""}, {"label": "Distribution Center Location Latitude Min", "field": "distribution_centers.location_latitude_min", "description": ""}, {"label": "Distribution Center Location Longitude Max", "field": "distribution_centers.location_longitude_max", "description": ""}, {"label": "Distribution Center Location Longitude Min", "field": "distribution_centers.location_longitude_min", "description": ""}, {"label": "Inventory Items Average Cost", "field": "inventory_items.average_cost", "description": ""}, {"label": "Inventory Items Count", "field": "inventory_items.count", "description": ""}, {"label": "Inventory Items Number On Hand", "field": "inventory_items.number_on_hand", "description": ""}, {"label": "Inventory Items Sold Count", "field": "inventory_items.sold_count", "description": ""}, {"label": "Inventory Items Sold Percent", "field": "inventory_items.sold_percent", "description": ""}, {"label": "Inventory Items Stock Coverage Ratio", "field": "inventory_items.stock_coverage_ratio", "description": "Stock on Hand vs Trailing 28d Sales Ratio"}, {"label": "Inventory Items Total Cost", "field": "inventory_items.total_cost", "description": ""}, {"label": "Order Items Average Days to Process", "field": "order_items.average_days_to_process", "description": ""}, {"label": "Order Items Average Gross Margin", "field": "order_items.average_gross_margin", "description": ""}, {"label": "Order Items Average Sale Price", "field": "order_items.average_sale_price", "description": ""}, {"label": "Order Items Average Shipping Time", "field": "order_items.average_shipping_time", "description": ""}, {"label": "Order Items Average Spend per User", "field": "order_items.average_spend_per_user", "description": ""}, {"label": "Order Items Count", "field": "order_items.count", "description": ""}, {"label": "Order Items Count Sold in Trailing 28 Days", "field": "order_items.count_last_28d", "description": ""}, {"label": "Order Items Median Sale Price", "field": "order_items.median_sale_price", "description": ""}, {"label": "Order Items Return Rate", "field": "order_items.return_rate", "description": ""}, {"label": "Order Items Returned Count", "field": "order_items.returned_count", "description": ""}, {"label": "Order Items Returned Total Sale Price", "field": "order_items.returned_total_sale_price", "description": ""}, {"label": "Order Items Total Gross Margin", "field": "order_items.total_gross_margin", "description": ""}, {"label": "Order Items Total Gross Margin Percentage", "field": "order_items.total_gross_margin_percentage", "description": ""}, {"label": "Order Items Total Sale Price", "field": "order_items.total_sale_price", "description": ""}, {"label": "Orders First Purchase Count", "field": "order_items.first_purchase_count", "description": ""}, {"label": "Orders Order Count", "field": "order_items.order_count", "description": ""}, {"label": "Products Brand Count", "field": "products.brand_count", "description": ""}, {"label": "Products Category Count", "field": "products.category_count", "description": ""}, {"label": "Products Count", "field": "products.count", "description": ""}, {"label": "Products Department Count", "field": "products.department_count", "description": ""}, {"label": "Repeat Purchase Facts 30 Day Repeat Purchase Rate", "field": "order_items.30_day_repeat_purchase_rate", "description": "The percentage of customers who purchase again within 30 days"}, {"label": "Repeat Purchase Facts Count with Repeat Purchase within 30 Days", "field": "order_items.count_with_repeat_purchase_within_30d", "description": ""}, {"label": "Users Approx Location", "field": "users.approx_location_latitude_min", "description": ""}, {"label": "Users Approx Location", "field": "users.approx_location_latitude_max", "description": ""}, {"label": "Users Approx Location", "field": "users.approx_location_longitude_min", "description": ""}, {"label": "Users Approx Location", "field": "users.approx_location_longitude_max", "description": ""}, {"label": "Users Average Age", "field": "users.average_age", "description": ""}, {"label": "Users Count", "field": "users.count", "description": ""}, {"label": "Users Count (Percent of Total)", "field": "users.count_percent_of_total", "description": ""}, {"label": "Users Facts Active User Count", "field": "user_order_facts.active_user_count", "description": ""}, {"label": "Users Facts Average Lifetime Margin", "field": "user_order_facts.average_lifetime_revenue", "description": ""}, {"label": "Users Facts Average Lifetime Orders", "field": "user_order_facts.average_lifetime_orders", "description": ""}, {"label": "Users Location", "field": "users.location_latitude_min", "description": ""}, {"label": "Users Location", "field": "users.location_latitude_max", "description": ""}, {"label": "Users Location", "field": "users.location_longitude_min", "description": ""}, {"label": "Users Location", "field": "users.location_longitude_max", "description": ""}]
    
    input: Number of Items by Shipped Date
    output: {"model": "thelook", "view": "order_items", "fields": ["order_items.count", "order_items.shipped_date"], "filters": {"order_items.shipped_date": "30 days"}, "sorts": ["order_items.shipped_date desc"], "pivots": null, "limit": "500"}

    input: Number of Orders for Accessories by Brand
    output: {"model": "thelook", "view": "order_items", "fields": ["order_items.order_count", "products.brand"], "filters": {"products.category": "Accessories"}, "sorts": [], "pivots": null, "limit": "500"}

    input: Number of Items by Brand
    output: {"model": "thelook", "view": "order_items", "fields": ["order_items.count", "products.brand"], "filters": {"order_items.reporting_period": "-NULL", "users.state": "", "users.city": "", "users.traffic_source": "", "users.gender": "", "distribution_centers.location": "", "users.country": "", "distribution_centers.name": ""}, "sorts": ["order_items.count desc"], "pivots": null, "limit": "500"}

    input: Number of Items by Shipped Month in the last 12 months
    output: {"model": "thelook", "view": "order_items", "fields": ["order_items.count", "order_items.shipped_month"], "filters": {"order_items.shipped_month": "12 months"}, "sorts": ["order_items.shipped_month desc"], "pivots": null, "limit": "500"}

    input: 30 Day Repeat Purchase Rate by Brand
    output: {"model": "thelook", "view": "order_items", "fields": ["order_items.30_day_repeat_purchase_rate", "products.brand"], "filters": null, "sorts": ["order_items.30_day_repeat_purchase_rate desc"], "pivots": null, "limit": "500"}

    input: Top 10 Brand by Sales
    output: {"model": "thelook", "view": "order_items", "fields": ["order_items.total_sale_price", "products.brand"], "filters": null, "sorts": ["order_items.toal_sale_price desc"], "pivots": null, "limit": "10"}

    input: Orders details on 04/06/2023 in USA
    output:  {"model": "thelook", "view": "order_items", "fields": ["order_items.order_id", "order_items.status", "order_items.created_date", "order_items.sale_price", "products.brand", "products.item_name", "users.name", "users.email"], "filters": {"order_items.created_date": "2023-06-04", "users.age_tier": "", "users.city": "", "users.state": "", "users.country": "", "user_order_facts.lifetime_revenue_tier": ""}, "sorts": [], "pivots": null, "limit": "500"}}

    input: What is margin last week ?
    output: {"model": "thelook", "view": "order_items", "fields": ["order_items.total_gross_margin", "order_items.created_date"], "filters": {"order_items.created_date": "last week"}, "sorts": [], "pivots": null, "limit": "500"}

    input: Top 10 performing brand last week by sales ?
    output: {"model": "thelook", "view": "order_items", "fields": ["order_items.total_sale_price", "products.brand"], "filters": {"order_items.created_date": "last week"}, "sorts": ["order_items.total_sale_price desc"], "pivots": null, "limit": "10"}

    input : user segement who likes Columbia and revenue more than 300$
    output : {"model": "thelook", "view": "order_items", "fields": ["user_order_facts.user_id", "user_order_facts.lifetime_revenue"], "filters": {"user_order_facts.lifetime_revenue": ">=300", "products.brand": "Columbia"}, "sorts": [], "pivots": null, "limit": "500"}

    input : Give me all the users with total revenue superior to 1000$
    output : {"model": "thelook", "view": "order_items", "fields": ["user_order_facts.user_id", "user_order_facts.lifetime_revenue"], "filters": {"user_order_facts.lifetime_revenue": ">=1000"}, "sorts": [], "pivots": null, "limit": "500"}

    input : total revenue by traffic source and category
    output : {"model": "thelook", "view": "order_items", "fields": ["order_items.total_sale_price", "products.category", "users.traffic_source"], "filters": null, "sorts": [], "pivots": ["products.category"], "limit": "500"}

    input : What's my sales this year vs last year ?
    output : {"model": "thelook", "view": "order_items", "fields": ["order_items.created_month_name", "order_items.total_sale_price", "order_items.created_year"], "filters": {"order_items.created_date": "before 0 months ago", "order_items.created_year": "180 days", "users.state": "", "users.city": "", "users.traffic_source": "", "users.gender": "", "distribution_centers.location": "", "users.country": "", "distribution_centers.name": ""}, "sorts": ["order_items.created_year desc 0", "order_items.created_month_name"], "pivots": ["order_items.created_year"], "limit": "500"}      
  `
  return generatedPrompt2;
  
  }

  // Test method
  const testCreateQuery = (promptToSend: string) =>
  {
    console.log("Sending Query123");
    // query to run
    const query_to_run =  `
    SELECT ml_generate_text_llm_result
    FROM
      ML.GENERATE_TEXT(
        MODEL llm.llm_model,
        (
          SELECT 'Write a simple JSON body output with the following rules.\n    Use the following data dictionary in order to search the relevant fields, filters sorts and pivots. \n    Always return model : bi_engine_demo and view: "undefined".\n    Field dictionary : [{"label":"Wiki100 M Day","field":"wiki100_m.day","description":""},{"label":"Wiki100 M Language","field":"wiki100_m.language","description":""},{"label":"Wiki100 M Month","field":"wiki100_m.month","description":""},{"label":"Wiki100 M Title","field":"wiki100_m.title","description":""},{"label":"Wiki100 M Views","field":"wiki100_m.views","description":""},{"label":"Wiki100 M Wikimedia Project","field":"wiki100_m.wikimedia_project","description":""},{"label":"Wiki100 M Year","field":"wiki100_m.year","description":""},{"label":"Wiki100 M Count","field":"wiki100_m.count","description":""}]\n    Make sure to only use the fields in the field dictionary.\n    Input: what are events per month?' AS prompt
        ),
        STRUCT(
          0.1 AS temperature,
          1000 AS max_output_tokens,
          0.1 AS top_p,
          TRUE AS flatten_json_output,
          10 AS top_k));
    `;

    const sql_query_create_param: ISqlQueryCreate = {
      connection_name:"dataml-latam-argolis",
      // sql:"SELECT * FROM `dataml-latam-argolis.us.stack_post` LIMIT 10"             
      sql: query_to_run
    }
    core40SDK.create_sql_query(sql_query_create_param).then(
      results => {
        // const resultadoOk = results.value;  
        // @ts-ignore
        const slug =  results.value.slug;
        if(slug != null)
        {          
          core40SDK.run_sql_query(slug, "json").then(
            results =>
            {               
              //@ts-ignore
              const json_value = results.value;              
              return `
              {"model": "thelook", "view": "order_items", "fields": ["order_items.created_month_name", "order_items.total_sale_price", "order_items.created_year"], "filters": {"order_items.created_date": "before 0 months ago", "order_items.created_year": "180 days", "users.state": "", "users.city": "", "users.traffic_source": "", "users.gender": "", "distribution_centers.location": "", "users.country": "", "distribution_centers.name": ""}, "sorts": ["order_items.created_year desc 0", "order_items.created_month_name"], "pivots": ["order_items.created_year"], "limit": "500"}
              `;                             
            }
          )          
        }
      }
    )
  }

  
  function transformArrayToString(array: string[]): string {
    // return 'teste \\n teste3'
    return array.join('\\n');
  }
  
  const sendPromptToBigQuery = (promptToSend: string) =>
  {
    const arraySplitted = promptToSend.split('\n');
    const singleLineString = transformArrayToString(arraySplitted);

    console.log("Sending Prompt to BigQuery LLM");
    // console.log(singleLineString);
    // query to run
    const query_to_run = `SELECT ml_generate_text_llm_result as r
    FROM
      ML.GENERATE_TEXT(
        MODEL llm.llm_model,
        (
          SELECT '`+ singleLineString + `' AS prompt
        ),
        STRUCT(
          0.1 AS temperature,
          1000 AS max_output_tokens,
          0.1 AS top_p,
          TRUE AS flatten_json_output,
          10 AS top_k));
    `;
    console.log("Query to Run: " + query_to_run);

    const sql_query_create_param: ISqlQueryCreate = {
      connection_name:"dataml-latam-argolis",
      sql: query_to_run         
    }
   

    // Create SQL Query to Run
    core40SDK.create_sql_query(sql_query_create_param).then(
      results => {
        // const resultadoOk = results.value;  
        // @ts-ignore
        const slug =  results.value.slug;
        console.log("Create BQML Query with slug: "  + slug);
        if(slug != null)
        {
          // Run SQL Query with Prompt
          core40SDK.run_sql_query(slug, "txt").then(
            results =>
            {        
              // @ts-ignore
              const results_string = results.value;
              var cleanString = results_string.replace('r', '');
              cleanString = cleanString.replace(/\`\`\`/g, '');              
              cleanString = cleanString.replace(/\"\"/g, '\"');
              cleanString = cleanString.slice(cleanString.indexOf('"')+1, cleanString.lastIndexOf('"') -1 );         
              var json_dict = JSON.parse(cleanString);
              console.log(cleanString);
              // Create a Query
              core40SDK.create_query(json_dict).then(
                results =>
                {
                  // @ts-ignore
                  console.log("Explore Url: " + results.value.explore_url)
                  // @ts-ignore
                  const query_id = results.value.id;
                  console.log("Query Id:" + query_id);                  
                  // // Update the Explore with New QueryId                  
                  LookerEmbedSDK.init(hostUrl!);
                  // if(currentExploreId!= null){
                  console.log("explore not null: " + currentExploreId);
                  LookerEmbedSDK.createExploreWithUrl("https://cloudcelatam.cloud.looker.com/"+ "embed/explore/"+ "dataml-latam-argolis" + "/"  + "joao" + "?qid=" + "dLmGbgXilWwHeNTLmjt8Ey")  
                  .appendTo(exploreDivElement!)              
                  .build()        
                  .connect()
                  .then(setupExplore)
                  .catch((error: Error) => {
                    console.error('Connection error', error)
                  });
                  // }

                  // debugger;
                  // // @ts-ignore
                  // console.log("Explore Url: " + results.value.explore_url)
                  // // @ts-ignore
                  // const query_id = results.value.client_id;
                  // // @ts-ignore
                  // const share_url = results.value.share_url;
                  // // @ts-ignore
                  // const urlValue = results.value.url;
                  // // @ts-ignore
                  // const viewName = results.value.view;
                  // console.log("Query Id:" + query_id);                  
                  // // // Update the Explore with New QueryId                  
                  // LookerEmbedSDK.init(hostUrl!);

                  // if(query_id!=null && currentLookerModel != null && viewName!=null){
                  //   console.log("current model not null: " + currentLookerModel);
                  //   LookerEmbedSDK.createExploreWithUrl(hostUrl+ "/embed/explore/"+ currentLookerModel.name! + "/"  + viewName! + "?qid=" + query_id)
                  //   .appendTo(exploreDivElement!)              
                  //   .build()        
                  //   .connect()
                  //   .then(setupExplore)
                  //   .catch((error: Error) => {
                  //     console.error('Connection error', error)
                  //   })
                    
                  // }
                  // else {
                  //   console.log("currentlookermodel is null");
                  // }         
                }
              );              
            }
          )          
        }
      }
    )
  }

  const extensionContext =
  useContext<ExtensionContextData>(ExtensionContext)

  
  const updateRunButton = (running: boolean) => {

  }

  const setupExplore = (explore: LookerEmbedExplore) => {
    
  }

  const embedCtrRef = useCallback((el) => {
    // if(hostUrl == null) {

    setHostUrl(extensionContext?.extensionSDK?.lookerHostData?.hostUrl);
    // }
    // if (el && hostUrl) {
    console.log("Entrou aqui "+ hostUrl);
    setExploreDivElement(el); 
    LookerEmbedSDK.init(hostUrl!);
    // if(currentExploreId!= null){
    console.log("explore not null: " + currentExploreId);
    // LookerEmbedSDK.createExploreWithUrl("https://cloudcelatam.cloud.looker.com/"+ "embed/explore/"+ "dataml-latam-argolis" + "/"  + "joao" + "?qid=" + "dLmGbgXilWwHeNTLmjt8Ey")  
    // .appendTo(exploreDivelement!)              
    // .build()        
    // .connect()
    // .then(setupExplore)
    // .catch((error: Error) => {
    //   console.error('Connection error', error)
    // })
          
    // }
  }, [])


  const handleSend = () => 
  {
    // 1. Generate Prompt based on the current selected Looker Explore (Model + ExploreName)
    console.log("Get the Dictionary from the right Explorer");  
    if(currentLookerModel!=null && currentExploreName!=null)
    {
      core40SDK.lookml_model_explore(currentLookerModel.name!, currentExploreName!, "id, name, description, fields, label").then
      (exploreResult => {
        // @ts-ignore
        const fields:ILookmlModelExploreFieldset = exploreResult.value.fields;
        const f_dimensions:ILookmlModelExploreField[]  =  fields.dimensions!;
        const f_measures:ILookmlModelExploreField[]  =  fields.measures!;
        const f_dim_measures = f_dimensions.concat(f_measures);
        var my_fields = [];
        if(f_dim_measures!=null)
        {
          for(var field of f_dim_measures)
          {
            var field_def = {
              // "field_type": "Dimension", this is not needed
              // "view_name": dimension.view_label,
              "label" : field.label,  
              "field": field.name,
              // "type": dimension.type,
              "description": field.description,
              // "sql": dimension.sql,
            };
            my_fields.push(field_def);
          }          
        }
        const jsonPayloadLookMLExplore = JSON.stringify(my_fields);
        // @ts-ignore
        const viewName = exploreResult.value.name!;
        // generatePrompt()
        const generatedPrompt = generatePrompt(jsonPayloadLookMLExplore, currentLookerModel.name!, viewName);
        // testCreateQuery(generatedPrompt);
        sendPromptToBigQuery(generatedPrompt);
              
      }) 

    }
    
    // console.log("prompt atual: " + prompt);    
    // 3. Receive the Payload and send to Looker API to retrieve the data
    // 4. Visualize the data
    // const IREquest
    // core40SDK.create_query
  }

  
  return (    
    <ComponentsProvider>
      <Space around>
        <Span fontSize="xxxxxlarge">
          {message}
        </Span>        
      </Space>
      <Space around>
        <Heading fontWeight="semiBold">Ask Looker Extension</Heading>
      </Space>
      <Box display="flex" m="large">
          <ExploreList
            loading={loadingLookerModels}
            lookmls={lookerModels}
            selectModel={selectModel}
            selectCurrentExplore={selectCurrentExploreName}
            currentExploreName=''
          />
          <SpaceVertical>
          <Space>
            <Button onClick={handleSend}>Send</Button>
            <Button onClick={handleClear}>Clear</Button>
          </Space>
          <FieldTextArea            
            width="100%"
            label="Type your question"  
            value={prompt}
            onChange={handleChange}
          />
       
        <EmbedContainer ref={embedCtrRef} />
        </SpaceVertical>                                   
      </Box>

    </ComponentsProvider>
  )
}