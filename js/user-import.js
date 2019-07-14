var api_base =
  "https://my-json-server.typicode.com/Grumpy-Leopard/ba-efo-importer";
var org_search_endpoint = "/org-search";
var grp_search_endpoint = "/group-search";

// TODO: CSRF stuff

var org_search_uri = api_base + org_search_endpoint + "?search=";
var grp_search_uri = api_base + grp_search_endpoint;

var searchTimer;
var csrfToken;

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

function processUsers(control, display) {
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;

  if (regex.test(control.value.toLowerCase())) {
    if (typeof FileReader != "undefined") {
      var reader = new FileReader();

      reader.onload = function(e) {
        var lines = e.target.result.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");

          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }

          result.push(obj);
        }

        display.innerHTML = "";

        result.forEach(user => {
          if (validateUserRecord(user)) {
            row = display.insertRow();

            cell = row.insertCell();
            cell.innerHTML = user.firstName;

            cell = row.insertCell();
            cell.innerHTML = user.lastName;

            cell = row.insertCell();
            cell.innerHTML = user.emailAddress;
          }
        });

        //return result; //JavaScript object
        console.log(result); //JSON
      };

      reader.readAsText(control.files[0]);
    } else {
      alert("This browser does not support HTML5.");
    }
  } else {
    alert("Please upload a valid CSV file.");
  }
}

function validateUserRecord(user) {
  // User needs at least a name and email address
  if (typeof user.firstName == "undefined") {
    return false;
  }
  if (typeof user.lastName == "undefined") {
    return false;
  }
  if (typeof user.emailAddress == "undefined") {
    return false;
  }
  // TODO more validation
  return true;
}
