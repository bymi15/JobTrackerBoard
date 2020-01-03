import React from "react";
import { connect } from 'react-redux';
import { fetchStages } from '../../../actions/api_stage';

import {
    FormGroup,
    Col,
    Label,
    Input,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";

import moment from 'moment';

import { faThumbsUp, faThumbsDown, faSquare, faSmile, faFrown, faMeh } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as faThumbsUpO, faThumbsDown as faThumbsDownO, faSquare as faSquareO, faSmile as faSmileO, faFrown as faFrownO, faMeh as faMehO } from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import 'pretty-checkbox/dist/pretty-checkbox.min.css';

class AddInterviewModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: { id: 1 },
            description: null,
            difficulty: 'easy',
            experience: 'positive',
            date: moment(new Date()).format("YYYY-MM-DD"),
            duration: null,
            location: null,
            result: null
        };
    }

    componentDidMount(){
       this.props.fetchStages();
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleQuestionChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleResultPending = (e) => {
        this.setState({result: null});
    }

    handleStageChange = (e) => {
        this.setState({stage: { id: e.target.value }});
    }

    render() {
        const { stages, isOpen, toggle, saveModal } = this.props;

        return (
            <React.Fragment>
                <Modal isOpen={isOpen} toggle={toggle} centered>
                    <ModalHeader toggle={toggle}>
                        Add Interview
                    </ModalHeader>
                    <ModalBody className="text-center m-3">
                        <FormGroup className="text-left">
                            <Label>Interview Type:</Label>
                            <Input type="select" name="stage" onChange={this.handleStageChange}>
                                {
                                    stages ? stages.map(stage => (
                                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                                    )) : ''
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Description:</Label>
                            <Input type="textarea" name="description" onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Date interviewed:</Label>
                            <Input type="date" name="date" value={this.state.date} onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>How long was the process?</Label>
                            <Input type="number" name="duration" min="1" max="720" placeholder="e.g. 30 (minutes)" onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Interview location:</Label>
                            <Input type="text" name="location" placeholder="e.g. London, UK" onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>How difficult was the interview?</Label>
                            <div>
                                <div className="pretty p-svg p-plain p-toggle p-bigger p-smooth">
                                    <Input type="radio" name="difficulty" value="easy" onChange={this.handleChange}/>
                                    <div className="state p-off">
                                        <FontAwesomeIcon className="svg" icon={faThumbsUpO}/>
                                        <label>Easy</label>
                                    </div>
                                    <div className="state p-on p-success-o">
                                        <FontAwesomeIcon className="svg" icon={faThumbsUp}/>
                                        <label>Easy</label>
                                    </div>
                                </div>
                                <div className="pretty p-svg p-plain p-toggle p-bigger p-smooth">
                                    <Input type="radio" name="difficulty" value="average" onChange={this.handleChange}/>
                                    <div className="state p-off">
                                        <FontAwesomeIcon className="svg" icon={faSquareO}/>
                                        <label>Average</label>
                                    </div>
                                    <div className="state p-on p-warning-o">
                                        <FontAwesomeIcon className="svg" icon={faSquare}/>
                                        <label>Average</label>
                                    </div>
                                </div>
                                <div className="pretty p-svg p-plain p-toggle p-bigger p-smooth">
                                    <Input type="radio" name="difficulty" value="difficult" onChange={this.handleChange}/>
                                    <div className="state p-off">
                                        <FontAwesomeIcon className="svg" icon={faThumbsDownO}/>
                                        <label>Difficult</label>
                                    </div>
                                    <div className="state p-on p-danger-o">
                                        <FontAwesomeIcon className="svg" icon={faThumbsDown}/>
                                        <label>Difficult</label>
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Interview result:</Label>
                            <div>
                                <div className="pretty p-default p-fill p-smooth">
                                    <Input type="radio" name="result" onChange={this.handleResultPending}/>
                                    <div className="state p-warning">
                                        <label>Pending</label>
                                    </div>
                                </div>
                                <div className="pretty p-default p-fill p-smooth">
                                    <Input type="radio" name="result" value={true} onChange={this.handleChange}/>
                                    <div className="state p-success">
                                        <label>Pass</label>
                                    </div>
                                </div>
                                <div className="pretty p-default p-fill p-smooth">
                                    <Input type="radio" name="result" value={false} onChange={this.handleChange}/>
                                    <div className="state p-danger">
                                        <label>Fail</label>
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Rate overall experience:</Label>
                            <div>
                                <div className="pretty p-svg p-plain p-toggle p-bigger p-smooth" style={{fontSize: '30px'}}>
                                    <Input type="radio" name="experience" value="positive" onChange={this.handleChange}/>
                                    <div className="state p-off">
                                        <FontAwesomeIcon className="svg" icon={faSmileO}/>
                                        <label></label>
                                    </div>
                                    <div className="state p-on p-success-o">
                                        <FontAwesomeIcon className="svg" icon={faSmile}/>
                                        <label></label>
                                    </div>
                                </div>
                                <div className="pretty p-svg p-plain p-toggle p-bigger p-smooth" style={{fontSize: '30px'}}>
                                    <Input type="radio" name="experience" value="neutral" onChange={this.handleChange}/>
                                    <div className="state p-off">
                                        <FontAwesomeIcon className="svg" icon={faMehO}/>
                                        <label></label>
                                    </div>
                                    <div className="state p-on p-warning-o">
                                        <FontAwesomeIcon className="svg" icon={faMeh}/>
                                        <label></label>
                                    </div>
                                </div>
                                <div className="pretty p-svg p-plain p-toggle p-bigger p-smooth" style={{fontSize: '30px'}}>
                                    <Input type="radio" name="experience" value="negative" onChange={this.handleChange}/>
                                    <div className="state p-off">
                                        <FontAwesomeIcon className="svg" icon={faFrownO}/>
                                        <label></label>
                                    </div>
                                    <div className="state p-on p-danger-o">
                                        <FontAwesomeIcon className="svg" icon={faFrown}/>
                                        <label></label>
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => saveModal(this.state)}>
                            ADD INTERVIEW
                        </Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    error: state.api_application.error,
    isLoading: state.api_application.isLoading,
    stages: state.api_stage.stages
});

const mapDispatchToProps = dispatch => ({
   fetchStages: () => dispatch(fetchStages())
})

export default connect(mapStateToProps, mapDispatchToProps)(AddInterviewModal);


