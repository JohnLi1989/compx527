<template>
  <div>
    <span>Choose a country</span>
    <select id="selCountry" v-model="countrySelected" @change="getCity">
            <option style='display: none'></option>
            <option v-for="(country,index) in countries" :value ="country.code">{{country.name}}</option>
    </select>
    <span>Choose a city</span>

    <select id="selCity" v-model="citySelected" @change="getLocation">
      <option style='display: none'></option>
      <option v-for="(city,index) in cities" :value ="city.city">{{city.city}}</option>
    </select>

    <span>Choose a location</span>
    <select id="selLocation" v-model="locationSelected" @change="getDetail">
      <option style='display: none'></option>
      <option v-for="(location,index) in locations" :value ="location.location">{{location.location}}</option>
    </select>

    <form>
      <label  v-for="(hour,index) in hours"><input v-model="checkedValue" :name="hour.hour" :id="hour.hour" type="radio" :value="hour.hour"/>{{hour.value}}</label>
    </form>

    <table width="90%" class="table4_1" v-show="show">
      <caption>
          <h2>Air Quality</h2>
      </caption>
      <thead>
          <tr>
              <th>contaminant</th>
              <th>value</th>
              <th>unit</th>
              <th>date</th>
          </tr>
      </thead>
      <tr v-for="(detail, index) in details">
          <td>
              {{detail.parameter.toUpperCase()}}
          </td>
          <td>
              {{detail.value}}
          </td>
          <td>
              {{detail.unit}}
          </td>
          <td>
              {{detail.date}}
          </td>
      </tr>

    </table>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
			name: "Index",
		  	data(){
          return{
            countries: [],
            cities: [],
            locations: [],
            countrySelected: "",
            citySelected:"",
            locationSelected:"",
            details: [],
            show: false,
            hours:[
              {hour:1, value: "1 hour"},
              {hour:12, value: "12 hours"},
              {hour:24, value: "24 hours"},
              {hour:24*7, value: "1 week"},
              {hour:24*7*28, value:"4 weeks"}
            ],
            checkedValue: 1,
          }
        },
        watch: {
          checkedValue: function(){
            this.getDetail()
          }
        },
		  	components:{

		  	},
		  	mounted() {
			  	this.getCountry();
        },
		  	methods: {
          getCountry(){
            axios.get('/api/country').then((result)=>{
              let countries = result.data.countries;
              this.countries = countries;
            });
          },
          getCity(){
            let country = this.countrySelected;
            axios.get('/api/city?country='+country).then((result)=>{
              let cities = result.data.cities;
              this.cities = cities;
            });
          },
          getLocation(){
            let city = this.citySelected;
            axios.get('/api/location?city='+city).then((result)=>{
              let locations = result.data.locations;
              this.locations = locations;
            });
          },
          getDetail(){
            let location = this.locationSelected;
            let hour = this.checkedValue;
            axios.get('/api/detail?location='+location+'&hour='+hour).then((result)=>{
              // for(let i of locations){
              //   for(let j of i.measurements){
              //     j.lastUpdated = this.dateFormatter(j.lastUpdated)
              //   }
              //   //i.measurements = this.setArr(i.measurements);
              //   //i.measurements = i.measurements.sort(this.sortArray("parameter"));
              // }
              this.details = result.data.results.Items;
              for(let i of this.details){
                i.date = this.dateFormatter(moment.unix(i.date))
              }
              this.show = true;
            });
          },
          sortArray(field){
            return function(a,b) {
              return a[field].localeCompare(b[field]);
            }
          },
          dateFormatter(value) {
            var date = moment.parseZone(value).local().format('YYYY-MM-DD HH:mm');
            return date;
          }
        },

		}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table4_1 table {
	width:100%;
	margin:15px 0;
	border:0;
}
.table4_1 th {
	background-color:#93DAFF;
	color:#000000
}
.table4_1,.table4_1 th,.table4_1 td {
	font-size:0.95em;
	text-align:center;
	padding:4px;
	border-collapse:collapse;
}
.table4_1 th,.table4_1 td {
	border: 1px solid #c1e9fe;
	border-width:1px 0 1px 0
}
.table4_1 tr {
	border: 1px solid #c1e9fe;
}
.table4_1 tr:nth-child(odd){
	background-color:#dbf2fe;
}
.table4_1 tr:nth-child(even){
	background-color:#fdfdfd;
}
</style>
