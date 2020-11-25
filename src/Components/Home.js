import React from "react";
import '../Assets/Home.css'
import axios from 'axios'
import loader from '../Assets/loader.gif'

class Home extends React.Component {
  constructor() {
    super();
    this.getFullData = this.getFullData.bind(this);
    this.getYears = this.getYears.bind(this);
    this.createButtonElements = this.createButtonElements.bind(this);
    this.getDataByYear = this.getDataByYear.bind(this);
    this.createCards = this.createCards.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    totalData :[],
    filteredArr : [],
    filterYears:[],
    isDataAvailable:false,
    yearCountMap:new Map(),
    launchSuccess:'',
    landSuccess:'',
    filterYear:''
  };
  getYears(){
    for(let x in this.state.totalData){
      this.state.filterYears.push(this.state.totalData[x].launch_year);
      this.state.yearCountMap.set(this.state.totalData[x].launch_year,0);
    }
    this.setState({
      isDataAvailable : true
    })
  }
  getDataByYear(year){
    this.setState({
      isDataAvailable : false
    })
    if(this.state.yearCountMap.has(year)){
      let count = this.state.yearCountMap.get(year);
      count++;
      this.state.yearCountMap.set(year,count);
    }
    if(this.state.yearCountMap.get(year)%2==0){
      this.state.filteredArr = this.state.totalData;
      this.setState({filterYear:''})
    }
    else{
      this.setState({filterYear:year})
      this.state.filteredArr = this.state.totalData.filter((data)=>{
        return data.launch_year == year
      })
    }
    this.setState({
      isDataAvailable : true
    })
  }
  createCards(){
    if(!this.state.isDataAvailable){
      return <img alt="loading" src={loader}></img>
    }
    else{
      return (
        <div>
        {
          this.state.filteredArr.map(mission => (
            <div key={mission.mission_name} className="custom-card">
            <img alt="logo"  height="60" src={mission.links.mission_patch}></img>
              <h5 className="bold">{mission.mission_name}</h5>
              <div className="custom-card-body">
              <span className="bold">Mission IDs</span>
              <br></br>
                {mission.mission_id.map(id=>(
                  <p>{id}</p>
                ))}
              <span className="bold">Launch Year:</span> {mission.launch_year}
              
              <br></br>
              <span className="bold">Successfull Launch:</span> {this.state.launchSuccess}
              <br></br>
              <span className="bold">Successfull Landing:</span> {this.state.landSuccess}
              <br></br>
              </div>
            </div>
        ))}
        </div>
      );
    }
  }
  createButtonElements(){ 
    let tempArr = [...new Set(this.state.filterYears)];
    if(tempArr==0){
      return <img alt="loading"  src={loader}></img>
    }
    else{
      return (
        <div>
        {
          tempArr.map(year => (
            <button key={year}  id={year} className="btn btn-success ml-2 mt-2 mb-2" key={year} onClick={() =>this.getDataByYear(year)}>
              {year}
            </button>
        ))}
        </div>
      );
    }
    
  }
  sortBySuccessFlag(){
    this.setState({
      isDataAvailable : false
    })
    var url = '';
    if(this.state.launchSuccess!='' && this.state.landSuccess==''){
      url = 'https://api.spaceXdata.com/v3/launches?limit=100&amp;launch_success='+this.state.launchSuccess;
    }
    if(this.state.launchSuccess=='' && this.state.landSuccess!=''){
      url = 'https://api.spaceXdata.com/v3/launches?limit=100&amp;land_success='+this.state.landSuccess;
    }
    else if(this.state.launchSuccess!='' && this.state.landSuccess!=''){
      url = 'https://api.spacexdata.com/v3/launches?limit=100&amp;launch_success='+this.state.launchSuccess+'&amp;land_success='+this.state.landSuccess;
    }
    axios.get(url)
    .then(response => {
     console.log(response.data);
     this.setState({
      totalData :response.data
     })
     this.getYears();
     this.setState({
      isDataAvailable : true
    })
    })
    .catch(err=>{
      console.log(err);
    });
  }
  getFullData(){
    var url = 'https://api.spaceXdata.com/v3/launches?limit=100';
    axios.get(url)
    .then(response => {
     console.log(response.data);
     this.setState({
      totalData :response.data
     })
     this.getYears();
    })
    .catch(err=>{
      console.log(err);
    });
  }
  componentDidMount(){
    this.getFullData();
  }
  handleChange(e){
    this.setState({
      [e.target.name] : e.target.value,
    })
    setTimeout(() => {
      this.sortBySuccessFlag();
    }, 500);
   
  }
  render() {

    return (
      <div className="center container-fluid">
        <h1 className="title">SpaceX Launch Programs</h1>
        <hr></hr>
        <div>
         <h3 className="filters">Filters</h3> 
         <div className="years-btn">
          <span className="">Launch Year</span>
          <hr></hr>
         </div> 
          <div>
            {this.createButtonElements()}
          </div>   
         <span className="text-center bold">Successfull Launch</span>
         <br></br>
         <input type="radio" id="true" onClick={this.handleChange} name="launchSuccess" value="true"/>
         <label className="ml-2 mr-2"  for="true">True</label>
         <input type="radio" id="false" onClick={this.handleChange} name="launchSuccess" value="false"/>
         <label className="ml-2 mr-2"  for="false">False</label>
         <br></br>
         <span className="text-center bold">Successfull Landing</span>
         <br></br>
         <input type="radio" id="true" onClick={this.handleChange} name="landSuccess" value="true"/>
         <label className="ml-2 mr-2" for="true">True</label>
         <input type="radio" id="false" onClick={this.handleChange} name="landSuccess" value="false"/>
         <label className="ml-2 mr-2"  for="false">False</label>
         <br></br>
        </div>      
        <div className="cards-main-div">
          {this.createCards()}
        </div>
      </div>
    );
  }
}
export default Home;