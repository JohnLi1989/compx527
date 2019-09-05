<template>
  <div>
    <el-select id="selCountry" v-model="countrySelected" @change="getCity" placeholder="Choose a country">
            <!-- <el-option style='display: none'></el-option> -->
            <el-option v-for="(country,index) in countries" :key="country.code" :value ="country.code">{{country.name}}</el-option>
    </el-select>

    <el-select id="selCity" v-model="citySelected" @change="getLocation" placeholder="Choose a city">
      <!-- <option style='display: none'></option> -->
      <el-option v-for="(city,index) in cities" :key="city.city" :value ="city.city">{{city.city}}</el-option>
    </el-select>

    <el-select id="selLocation" v-model="locationSelected" @change="getDetail" placeholder="Choose a location">
      <!-- <option style='display: none'></option> -->
      <el-option v-for="(location,index) in locations" :key="location.location" :value ="location.location">{{location.location}}</el-option>
    </el-select>

    <div style="margin-top: 20px">
      <el-radio-group size="small" v-model="checkedValue">
        <el-radio-button v-for="(hour, index) in hours" :key="hour.hour" :label="hour.hour" :id="hour.hour">{{hour.value}}</el-radio-button>
      </el-radio-group>
    </div>

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
    <div style="width:50%; heigh:50%;margin:0 auto">
      <canvas id="myChart2"></canvas>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Chart from 'chart.js'
import { Line } from 'vue-chartjs'

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
              {hour:12, value: "12 hours"},
              {hour:24, value: "24 hours"},
              {hour:24*7, value: "1 week"},
              {hour:24*7*28, value:"4 weeks"}
            ],
            checkedValue: 12,
            showchart: true,
            labels: [],
            chartdata: [],
            //options: []
          }
        },
        watch: {
          checkedValue: function(){
            this.getDetail()
          }
        },
		  	components:{

        },
        // extends: Line,
        // props: {
        //   chartData: {
        //     type: Object,
        //     default: null
        //   },
        //   options: {
        //     type: Object,
        //     default: null
        //   }
        // },
		  	mounted() {
          this.getCountry();
          //this.renderChart(this.chartdata, this.options)
          //this.Chart();


        },
		  	methods: {
          Chart() {
            var ctx2 = document.getElementById("myChart2");
            var myChart2 = new Chart(ctx2, {
                type: "line",
                data: {
                    labels: this.labels,
                    datasets: this.chartdata
                    // [
                    //     {
                    //         label: "test1",
                    //         backgroundColor: "rgba(225,10,10,0.3)",
                    //         borderColor: "rgba(225,103,110,1)",
                    //         borderWidth: 1,
                    //         pointStrokeColor: "#fff",
                    //         pointStyle: "crossRot",
                    //         data: [65, 59, 0, 81, 56, 10, 40, 22, 32, 54, 10, 30],
                    //         cubicInterpolationMode: "monotone",
                    //         spanGaps: "false",
                    //         fill: "false"
                    //     }
                    // ]
                },
                options: {

                }

            });
          },
          getCountry(){
            axios.get('/api/country').then((result)=>{
              let countries = result.data.countries;
              this.countries = countries;
            });
          },
          getCity(){
            this.show = false,
            this.citySelected = "";
            this.locationSelected = "";
            let country = this.countrySelected;
            axios.get('/api/city?country='+country).then((result)=>{
              let cities = result.data.cities;
              this.cities = cities;
            });
          },
          getLocation(){
            this.show = false,
            this.locationSelected = "";
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
              if(this.details.length > 0){
                this.labels = [],
                this.chartdata = [],
                this.chartdata.push({
                              label: this.details[0].parameter,
                              backgroundColor: "rgba(225,10,10,0.3)",
                              borderColor: "rgba(225,103,110,1)",
                              borderWidth: 1,
                              pointStrokeColor: "#fff",
                              pointStyle: "crossRot",
                              data: [],
                              cubicInterpolationMode: "monotone",
                              spanGaps: "false",
                              fill: "false"
                          })
                for(let i of this.details){
                  i.date = this.dateFormatter(moment.unix(i.date))
                  if(i.parameter==this.chartdata[0].label){
                    this.labels.push(i.date)
                    this.chartdata[0].data.push(i.value)
                  }
                }

                this.Chart();
              }
            });

            this.show = true;
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
#myChart2{
  width: 400px;
  height: 400px;
}
</style>
