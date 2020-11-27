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
    if(this.state.filterYear=='' && this.state.launchSuccess=='' && this.state.landSuccess==''){
      this.state.filteredArr = this.state.totalData;
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
      this.state.filteredArr = this.state.totalData.filter((data)=>{
        return data.launch_year == year
      })
      this.setState({filterYear:year})
    }
    this.setState({
      isDataAvailable : true
    })
    
  }
  createCards(){
    if(!this.state.isDataAvailable && this.state.filterYears.length!=0){
      return <img className="cards-loader" alt="loading" src={loader}></img>
      //return
    }
    else{
      return (
        <div>
        {
          this.state.filteredArr.map(mission => (
            <div key={mission.mission_name} className="custom-card">
            <img alt="logo"  height="60" className="mt-2" src={mission.links.mission_patch}></img>
              <h5 className="bold">{mission.mission_name}</h5>
              <div className="custom-card-body">
              <span className="bold">Mission IDs</span>
              <br></br>
                {mission.mission_id.map(id=>(
                  <p key={id}>{id}</p>
                ))}
              <span className="bold">Launch Year:</span> {mission.launch_year}
              <br></br>
              <span className="bold">Successfull Launch:</span> {(this.state.launchSuccess)==''?'NA':this.state.launchSuccess}
              <br></br>
              <span className="bold mb-2">Successfull Landing:</span> {(this.state.landSuccess)==''?'NA':this.state.landSuccess}
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
            <button key={year}  id={year} className="custom-button" key={year} onClick={() =>this.getDataByYear(year)}>
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
     
     this.setState({
      totalData :response.data
     })
     this.getYears();
     if(this.state.filterYear!=''){
          this.getDataByYear(this.state.filterYear);
      }
      else{
        this.state.filteredArr = this.state.totalData;
      }
     
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
      isDataAvailable : false
    })
    this.setState({
      [e.target.name] : e.target.value,
    })
    setTimeout(() => {
      this.sortBySuccessFlag();
    }, 100);
   
  }
  render() {

    return (
      <div className="center">
        <h1 className="title">SpaceX Launch Programs</h1>
        <hr></hr>
        <div className="center container-div">
          <div className="filters-div">
            <h3 className="filters">Filters</h3> 
            <hr></hr>
            <div className="years-btn">
              <span className="bold">Launch Year</span>
            </div> 
            <div>
              {this.createButtonElements()}
            </div>   
            <span className="text-center bold">Successfull Launch</span>
            <br></br>
            <button className="custom-button" type="button" id="launchSuccesstrue" onClick={this.handleChange} name="launchSuccess" value="true">True</button>
            <button className="custom-button" type="button" id="launchSuccessfalse" onClick={this.handleChange} name="launchSuccess" value="false">False</button>
            <br></br>
            <span className="text-center bold">Successfull Land</span>
            <br></br>
            <button className="custom-button" type="button" id="landSuccesstrue" onClick={this.handleChange} name="landSuccess" value="true">True</button>
            <button className="custom-button" type="button" id="landSuccessfalse" onClick={this.handleChange} name="landSuccess" value="false">False</button>
            {/* <span className="text-center bold">Successfull Landing</span>
            <br></br>
            <input type="radio" id="landSuccesstrue" onClick={this.handleChange} name="landSuccess" value="true"/>
            <label className="ml-2 mr-2" htmlFor="landSuccesstrue">True</label>
            <input type="radio" id="landSuccessfalse" onClick={this.handleChange} name="landSuccess" value="false"/>
            <label className="ml-2 mr-2"  htmlFor="landSuccessfalse">False</label> */}
            <br></br>
          </div>      
          <div className="cards-main-div">
            {this.createCards()}
          </div>
        </div>
      </div>
    );
  }
}
export default Home;