import React,{ useEffect,useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addTeam, getAllTeams, addPlayer, addMatch} from '../../actions/match';
import Loader from '../utils/Loader';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const Admin = ({
    match,
    addTeam,
    getAllTeams,
    addPlayer,
    addMatch
}) => {

    const { addTeamL,getallteamL,addplayerL,addMatchL } = match;
    const [ error,setError ] = useState(''); 
    const [ msg,setMsg ] = useState('');

    const [ addTeamData,setAddTeamData ] = useState({
        team_fullname : '',
        team_halfname : ''
    });
    const { team_fullname,team_halfname } = addTeamData ;


    const [ selectPlayerTeamList , setSelectPlayerTeamList ] = useState([]);
    const [ selectplayerteamlistupdated, setselectplayerteamlistupdated ] = useState(false);
    const [ positionList ] = useState([
        {
            label:"Goalkeeper",
            value:"gk"
        },
        {
            label:"Defender",
            value:"def"
        },
        {
            label:"Midfielder",
            value:"mid"
        },
        {
            label:"Striker",
            value:"stk"
        }
    ])
    const [ addPlayerPosition, setAddPlayerPosition ] = useState('');
    const [ addPlayerData,setAddPlayerData ] = useState({
        team : '',
        player_firstname : '',
        player_lastname : '',
        position : ''
    });
    const { player_firstname,player_lastname } = addPlayerData ;
    const [ addPlayerTeamhalfname, setAddPlayerTeamHalfname ] = useState('');

    const [ addMatchTeamOne, setAddMatchTeamOne ] = useState('');
    const [ addMatchTeamTwo, setAddMatchTeamTwo ] = useState('');
    const [ dateTime, setDateTime ] = useState('2020-MM-DDTHH:MM:00Z');
    const [ selectMatchTeamList , setSelectMatchTeamList ] = useState([]);
    const [ selectmatchteamlistupdated, setselectmatchteamlistupdated ] = useState(false);

    function handleAddTeam(){
        if(team_fullname.length === 0)
            setError('Enter Team FullName!');
        else if(team_halfname.length === 0 || team_halfname.length !== 3)
            setError('Team halfname must be exactly 3 letters!');
        else
            addTeam(team_fullname,team_halfname);
    }

    function handleAddPlayer(){
        if(addPlayerTeamhalfname.label === '')
            setError('Select team for the player!');
        else if(player_firstname.length === 0)
            setError('Enter Player Firstname!');
        else if(player_lastname.length === 0)
            setError('Enter Player Lastname!');
        else if(addPlayerPosition.value === '' || addPlayerPosition.label === '' || addPlayerPosition.value === undefined || addPlayerPosition.label === undefined)
            setError('Select position for the player!');
        else
            addPlayer(addPlayerTeamhalfname.label,player_firstname,player_lastname,addPlayerPosition.label,addPlayerPosition.value);
    }

    function handleAddMatch(){
        if(addMatchTeamOne.label === '' || addMatchTeamOne.label === undefined)
            setError('Select team one!');
        else if(addMatchTeamTwo.label === '' || addMatchTeamTwo.label === undefined)
            setError('Select team two!');
        else if(dateTime === '' || dateTime === '2020-MM-DDTHH:MM:00Z')
            setError('Set date and time for match!');
        else
            addMatch(addMatchTeamOne.value,addMatchTeamOne.label,addMatchTeamTwo.value,addMatchTeamTwo.label,dateTime);
    }


    useEffect(() => {
        getAllTeams();
    }, [])

    useEffect(() => {
        if(error && error.length > 0){
            setTimeout(function(){
                setError('');
            },3000);
        }
        if(match && match.error){
            setError(match.error);
            match.error = '';
        }

        if(msg && msg.length > 0){
            setTimeout(function(){
                setMsg('');
            },3000);
        }
        if(match && match.message){
            setMsg(match.message);
            match.message = '';
        }

        if(match && match.teams && !selectplayerteamlistupdated){
            let temp = [];
            match.teams.forEach(team => temp.push(team.halfname));
            setSelectPlayerTeamList([...temp]);
            setselectplayerteamlistupdated(true);
        }

        if(match && match.teams && !selectmatchteamlistupdated){
            let temp = [];
            match.teams.forEach(team => temp.push({
                value: team.halfname,
                label: team.fullname
            }));
            setSelectMatchTeamList([...temp]);
            setselectmatchteamlistupdated(true);
        }
    })

    const onAddTeamChange = e => setAddTeamData({ ...addTeamData , [e.target.name] : e.target.value });
    const onAddPlayerChange = e => setAddPlayerData({ ...addPlayerData , [e.target.name] : e.target.value });

    return (
        <div>
            {addTeamL || getallteamL || addplayerL || addMatchL ? <Loader/> : ''}
            <div className="page-minht">
                <div className="flex-jc-ac abs">
                    { 
                        error && error.length > 0 ? 
                            <div className="alert alert-danger">
                                {error}
                            </div> :
                            ''
                    }
                    { 
                        msg && msg.length > 0 ? 
                            <div className="alert alert-success">
                                {msg}
                            </div> :
                            ''
                    }
                </div>
                <div className="padTB">
                    <p style={{textAlign:"center"}}>Add team</p>
                    <div className="flex-jc-ac">
                        <input type="text" value={team_fullname} name="team_fullname" 
                                placeholder='Team Fullname' autoComplete="off"
                                onChange={e=>onAddTeamChange(e)}/>
                        <input type="text" value={team_halfname} name="team_halfname" 
                                placeholder='Team Halfname' autoComplete="off"
                                onChange={e=>onAddTeamChange(e)}/>
                        <div className="specialCrush normalBTN" onClick={()=> handleAddTeam()}>Add Team</div>
                    </div>
                </div>
                <hr/>
                <div className="padTB">
                    <p style={{textAlign:"center"}}>Add Player</p>
                    <div>
                        <div className="flex-jc-ac padTB">
                            <p>Select Team</p>
                            <Dropdown onChange={(team) => setAddPlayerTeamHalfname(team)} 
                                                        value={addPlayerTeamhalfname} 
                                                        options={ selectPlayerTeamList } />
                        </div> 
                        <div className="flex-jc-ac padTB">                                          
                            <input type="text" value={player_firstname} name="player_firstname" 
                                    placeholder='Firstname' autoComplete="off"
                                    onChange={e=>onAddPlayerChange(e)}/>
                            <input type="text" value={player_lastname} name="player_lastname" 
                                    placeholder='Lastname' autoComplete="off"
                                    onChange={e=>onAddPlayerChange(e)}/>
                        </div>
                        <div className="flex-jc-ac padTB">
                            <p>Select Position</p>
                            <Dropdown onChange={(pos) => setAddPlayerPosition(pos)} 
                                                        value={addPlayerPosition} 
                                                        options={ positionList } />
                        </div>
                        <div className="flex-jc-ac">
                            <div className="specialCrush normalBTN" onClick={()=> handleAddPlayer()}>Add Player</div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="padTB">
                    <p style={{textAlign:"center"}}>Add Match</p>
                    <div>
                        <div className="flex-jc-ac padTB">
                            <p>Select Team one</p>
                            <Dropdown onChange={(team) => setAddMatchTeamOne(team)} 
                                                        value={addMatchTeamOne} 
                                                        options={ selectMatchTeamList } />
                        </div> 
                        <div className="flex-jc-ac padTB">
                            <p>Select Team two</p>
                            <Dropdown onChange={(team) => setAddMatchTeamTwo(team)} 
                                                        value={addMatchTeamTwo} 
                                                        options={ selectMatchTeamList } />
                        </div> 
                        <div className="padTB createyourteam">
                            <p>Date Time String</p>
                            <input type="text" value={dateTime} name="dateTime" 
                                    autoComplete="off"
                                    onChange={e=>setDateTime(e.target.value)}
                                    style={{minWidth:"200px"}}/>
                        </div>
                        <div className="flex-jc-ac">
                            <div className="specialCrush normalBTN" onClick={()=> handleAddMatch()}>Add Match</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Admin.propTypes = {
    auth : PropTypes.object,
    match : PropTypes.object,
    addTeam : PropTypes.func.isRequired,
    getAllTeams : PropTypes.func.isRequired,
    addPlayer : PropTypes.func.isRequired,
    addMatch : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth : state.auth,
    match : state.match,
})

export default connect(
    mapStateToProps,
    { addTeam, getAllTeams, addPlayer, addMatch }
)(Admin);