import React from "react";
import { connect } from 'react-redux';
import { fetchBoardlists } from '../../../actions/api_boardlist';
import { searchCompany, clearSearch } from '../../../actions/api_company';
import CompanySearchText from "../../../components/CompanySearchText";

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
            logo_url: null,
            role: "",
            board_list: 1
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        if(name==="company_name"){
            if(value.trim()){
                this.props.searchCompany(value);
            }else{
                this.props.clearSearch();
            }
        }
    }

    handleSelectCompany = (company) => {
        this.setState({ company_name: company.name, logo_url: company.logo_url });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.boardlist !== this.props.boardlist){
          this.setState({ board_list: this.props.boardlist })
        }
    }

    render() {
        const { boardlists, isOpen, toggle, saveModal, companies } = this.props;
        const { company_name, board_list, logo_url } = this.state;

        return (
            <React.Fragment>
                <Modal isOpen={isOpen} toggle={toggle} centered>
                    <ModalHeader toggle={toggle}>
                        Add Job
                    </ModalHeader>
                    <ModalBody className="text-center m-3">
                        <FormGroup className="text-left">
                            <Label>Company:</Label>
                            <CompanySearchText name="company_name" value={company_name} onChange={this.handleChange} logo_url={logo_url} handleSelectCompany={this.handleSelectCompany} companies={companies}/>
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Job Title:</Label>
                            <Input type="text" name="role" onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup className="text-left">
                            <Label>Stage:</Label>
                            <Input type="select" name="board_list" value={board_list} onChange={this.handleChange}>
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
    companies: state.api_company.companies,
    boardlists: state.api_boardlist.boardlists
});

const mapDispatchToProps = dispatch => ({
    fetchBoardlists: () => dispatch(fetchBoardlists()),
    searchCompany: (query) => dispatch(searchCompany(query)),
    clearSearch: () => dispatch(clearSearch())
})

export default connect(mapStateToProps, mapDispatchToProps)(AddJobModal);


