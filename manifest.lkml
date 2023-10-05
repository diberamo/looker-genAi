project_name: "dbrm_genai_looker"

# # Use local_dependency: To enable referencing of another project
# # on this instance with include: statements
#
# local_dependency: {
#   project: "name_of_other_project"
# }

project_name: "looker-genai"
application: looker-genai {
  label: "Looker dbrm GenAI Extension"
   # for development: url: "https://localhost:8080/bundle.js"
  # production
   file: "bundle.js"
  entitlements: {
    use_embeds: yes
    use_form_submit: yes
    use_iframes: yes
    external_api_urls: ["https://localhost:8080","http://localhost:8080"]
    core_api_methods: ["run_inline_query", "me", "all_looks", "run_look", "all_lookml_models", "run_sql_query", "create_sql_query",
      "lookml_model_explore", "create_query", "use_iframes", "use_embeds",  "use_form_submit",
      "all_dashboards", "dashboard_dashboard_elements", "run_query", "dashboard", "lookml_model"] #Add more entitlements here as you develop new functionality
  }
}
