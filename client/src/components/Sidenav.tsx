import React from 'react';
import  './Sidenav.css';

type Props = {
    expanded: boolean,
    callback: Function
}
type State = {
    name: String,
    version: String
}

class Sidenav extends React.Component<Props, State> {

    componentDidMount() {
        
        const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080"
        const resourceUrl = baseURI + '/api/me'
        fetch(resourceUrl)
            .then(results => results.json())
            .then(data => {this.setState(data)})
    }
    
    render() {
    return (
        <div className="sidenav" style={this.props.expanded ? {width: "250px"} : {width: "0px"}}> 
            <div className="sidenav-close">
                <div className="sidenav-close-cross" onClick={() => {if (this.props.callback) {this.props.callback()}}}></div>
            </div>
                
                <h2>Meny</h2>
                <p>Användare: {this.state?.name}</p>

                <hr></hr>
                <a href="/users">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_user64.png'} alt=""></img>
                        Användare                
                    </div>
                </a>  
                <a href="/groups">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_group64.png'} alt=""></img>
                        Grupper
                    </div>
                </a>
                <hr></hr>
                <a href="/grouplist">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_list64.png'} alt=""></img>
                        Listvy
                    </div>
                </a>
                <a href="/grouptree">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_node64.png'} alt=""></img>
                        Trädvy
                    </div>
                </a>
                <hr></hr>
                <a href="/logout">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_exit64.png'} alt=""></img>
                        Logga ut
                    </div>
                </a>

                <p style={{bottom: 0, position: "absolute"}}>FAS v. {this.state?.version}</p>
                <p style={{bottom: 20, position: "absolute"}}>By F.dev 2020</p>
        </div>
    )
    }
}

export default Sidenav;