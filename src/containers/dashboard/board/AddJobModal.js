import React from "react";
import { connect } from 'react-redux';
import { fetchBoardlists } from '../../../actions/api_boardlist';

import {
    FormGroup,
    Label,
    Input,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";

class AddJobModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            company_name: "",
            role: "",
            board_list: 1
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.boardlist !== this.props.boardlist){
          this.setState({ board_list: this.props.boardlist })
        }
    }

    render() {
        const { boardlists, isOpen, toggle, saveModal } = this.props;

        return (
            <React.Fragment>
                <Modal isOpen={isOpen} toggle={toggle} centered>
                    <ModalHeader toggle={toggle}>
                        Add Job
                    </ModalHeader>
                    <ModalBody className="text-center m-3">
                        <FormGroup className="text-left">
                            <Label>Company:</Label>
                            <Input type="text" name="company_name" onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Job Title:</Label>
                            <Input type="text" name="role" onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Stage:</Label>
                            <Input type="select" name="board_list" value={this.state.board_list} onChange={this.handleChange}>
                                {
                                    boardlists ? boardlists.map(boardlist => (
                                        <option key={boardlist.id} value={boardlist.id}>{boardlist.title}</option>
                                    )) : ''
                                }
                            </Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => saveModal(this.state)}>
                            ADD JOB
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
    boardlists: state.api_boardlist.boardlists
});

const mapDispatchToProps = dispatch => ({
    fetchBoardlists: () => dispatch(fetchBoardlists())
})

export default connect(mapStateToProps, mapDispatchToProps)(AddJobModal);


