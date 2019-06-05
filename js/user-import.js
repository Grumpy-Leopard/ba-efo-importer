var api_base =
  "https://my-json-server.typicode.com/Grumpy-Leopard/ba-efo-importer";
var org_search_endpoint = "/org-search";
var grp_search_endpoint = "/group-search";

var org_search_uri = api_base + org_search_endpoint + "?search=";
var grp_search_uri = api_base + grp_search_endpoint;

var searchTimer;

function refreshOrgList(input, dropdown) {
  searchtext = input.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (searchtext.length >= 5) {
      orglist = await searchOrg(searchtext);
      dropdown.length = 0;
      let defaultoption = document.createElement("option");
      defaultoption.text = "Select . . .";
      defaultoption.value = "";
      defaultoption.disabled = true;
      dropdown.add(defaultoption);
      dropdown.selectedIndex = 0;

      orglist.forEach(item => {
        option = document.createElement("option");
        option.value = item.orgId;
        option.text = item.orgName;
        dropdown.add(option);
      });

    } else {
      console.log("Search too short");
    }
  }, 1000);
}

async function searchOrg(org) {
  const response = await fetch(org_search_uri + org);
  const json = await response.json();
  return json;
}

async function refreshGrpList(input, dropdown) {
  if (input.value != "") {
    grplist = await searchGrp(input.value);
    dropdown.length = 0;
    let defaultoption = document.createElement("option");
    defaultoption.text = "Select . . .";
    defaultoption.value = "";
    defaultoption.disabled = true;
    dropdown.add(defaultoption);
    dropdown.selectedIndex = 0;

    grplist.forEach(item => {
      if (item.orgId == input.value) {
        option = document.createElement("option");
        option.value = item.groupId;
        option.text = item.groupName;
        dropdown.add(option);
      } else {
        console.log("Skipping org value: " + item.orgId);
      }
    });
  }
}

async function searchGrp(orgId) {
  const response = await fetch(grp_search_uri);
  const json = await response.json();
  return json;
}
