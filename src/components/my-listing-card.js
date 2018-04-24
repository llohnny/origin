import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import moment from 'moment'

import origin from '../services/origin'

class MyListingCard extends Component {
  constructor(props) {
    super(props)

    this.closeListing = this.closeListing.bind(this)
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip()
  }

  async closeListing() {
    const { address } = this.props.listing
    const prompt = confirm('Are you sure that you want to permanently close this listing? This cannot be undone.')

    if (!prompt) {
      return null
    }

    try {
      const transactionReceipt = await origin.listings.close(address)
      console.log(transactionReceipt)
      const blockNumber = await origin.contractService.waitTransactionFinished(transactionReceipt.tx)
      console.log(blockNumber)
      this.props.handleUpdate(address)
    } catch(error) {
      console.error(`Error closing listing ${address}`)
    }
  }

  render() {
    const { address, category, createdAt, name, pictures, price, unitsAvailable } = this.props.listing
    /*
     *  Micah 4/23/2018
     *  ~~~~~~~~~~~~~~~
     *  origin.listings.close sets unitsAvailable to 0.
     *  There is no distinction between active/inactive, sold out, or closed.
     *  These states should be considered as editing is explored.
     *  There are no denormalized "transaction completed" or "transaction in progress" counts.
     */
    const status = unitsAvailable > 0 ? 'active' : 'inactive'
    // const timestamp = `Created on ${moment(createdAt).format('MMMM D, YYYY')}`

    return (
      <div className="transaction card">
        <div className="card-body d-flex flex-column flex-lg-row">
          <div className="aspect-ratio">
            <div className="image-container">
              <img src={(pictures && pictures.length > 0 && (new URL(pictures[0])).protocol === "data:") ? pictures[0] : '/images/default-image.jpg'} role="presentation" />
            </div>
          </div>
          <div className="content-container d-flex flex-column">
            <span className={`status ${status}`}>{status}</span>
            <p className="category">{category}</p>
            <h2 className="title text-truncate"><Link to={`/listing/${address}`}>{name}</Link></h2>
            {/*<p className="timestamp">{timestamp}</p>*/}
            <p className="price">
              {`${Number(price).toLocaleString(undefined, { minimumFractionDigits: 3 })} ETH`}
              {/*unitsAvailable <= quantity && <span className="badge badge-info">Sold Out</span>*/}
            </p>
            <div className="d-flex counts">
              <p>Total Quantity: {unitsAvailable.toLocaleString()}</p>
              {/*<p>Total Remaining: {(unitsAvailable - quantity).toLocaleString()}</p>*/}
            </div>
            <div className="d-flex counts">
              {/*<p>{Number(2).toLocaleString()} Pending Transactions</p>*/}
              {/*<p>{Number(3).toLocaleString()} Completed Transactions</p>*/}
            </div>
            <div className="actions d-flex">
              <div className="links-container">
                {/*<a onClick={() => alert('To Do')}>Edit</a>*/}
                {/*!active && <a onClick={() => alert('To Do')}>Enable</a>*/}
                {/*active && <a onClick={() => alert('To Do')}>Disable</a>*/}
                {!!unitsAvailable && <a className="warning" onClick={this.closeListing}>Close Listing</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MyListingCard
