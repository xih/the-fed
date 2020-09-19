import React from 'react';
import { connect } from 'react-redux'
import { getAccounts } from '../../Stores/Plaid/Selectors'
import { Card, Button } from 'react-bootstrap'

const AccountsPage = ({ accounts }) => {

  const accountCards = accounts.map(account => (
    <>
      <Card>
        <Card.Header as="h5">{account.name}</Card.Header>
        <Card.Body>
          <Card.Title>{account.subtype} {account.mask}</Card.Title>
          <Card.Text>
            With supporting text below as a natural lead-in to additional content.
        </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
      <br />
    </>
  ))

  return (
    <div>
      Accounts Page!!!
      {accountCards}
    </div>
  );
};
const mapStateToProps = state => ({
  accounts: getAccounts(state)
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage);