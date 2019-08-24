<template>
  <div>
    <span>Choose a country</span>
    <select id="selCountry" v-model="countrySelected" @change="getCity">
            <option style='display: none'></option>
            <option v-for="(country,index) in countries" :value ="country.code">{{country.name}}</option>
    </select>
    <span>Choose a city</span>

    <select id="selCity" v-model="citySelected" @change="getDetail">
      <option style='display: none'></option>
      <option v-for="(city,index) in cities" :value ="city.city">{{city.city}}</option>
    </select>


    <table width="90%" class="table4_1" v-show="show">
      <caption>
          <h2>Air Quality</h2>
      </caption>
      <thead>
          <tr>
              <th>Location</th>
              <!-- <th>CO</th>
              <th>NO2</th>
              <th>O3</th>
              <th>PM2.5</th>
              <th>PM10</th>
              <th>SO2</th> -->

          </tr>
      </thead>
      <tr v-for="(location, index) in locations">
          <td>
              {{location.location}}
          </td>
          <td v-for="(measurement, index) in location.measurements">
            {{measurement.parameter.toUpperCase()}} {{measurement.value}} {{measurement.unit}}
            <br />
            {{measurement.lastUpdated}}
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
            show: false,
          }
		  	},
		  	components:{

		  	},
		  	mounted() {
			  	this.getCountry();
        },
		  	methods: {
          getCountry(){
            axios.get('/country').then((result)=>{
              let countries = result.data.countries;
              this.countries = countries;
            });
          },
          getCity(){
            let country = this.countrySelected;
            axios.get('/city?country='+country).then((result)=>{
              let cities = result.data.cities;
              this.cities = cities;
            });
          },
          getDetail(){
            let city = this.citySelected;
            axios.get('/detail?city='+city).then((result)=>{
              let locations = result.data.results;
              for(let i of locations){
                for(let j of i.measurements){
                  j.lastUpdated = this.dateFormatter(j.lastUpdated)
                }
                //i.measurements = this.setArr(i.measurements);
                //i.measurements = i.measurements.sort(this.sortArray("parameter"));
              }
              this.show = true;
              this.locations = locations;
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
