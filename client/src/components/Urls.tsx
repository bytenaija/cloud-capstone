import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Dimmer,
  TextArea,

} from 'semantic-ui-react'

import { createUrl, deleteUrl, getUrls, patchUrl } from '../api/urls-api'
import Auth from '../auth/Auth'
import { Url } from '../types/Url'

const Row = Grid.Row;
const Column = Grid.Column

interface UrlsProps {
  auth: Auth
  history: History
}

interface UrlsState {
  urls: Url[]
  url: string,
  description: string,
  loadingUrls: boolean,
  saving: boolean
}

export class Urls extends React.PureComponent<UrlsProps, UrlsState> {
  state: UrlsState = {
    urls: [],
    url: '',
    description: '',
    loadingUrls: true,
    saving: false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ url: event.target.value })
  }

  handleDescriptionChange = (event: any) => {
    console.log(event, "vs", event.target.value)
    this.setState({ description: event.target.value})
  }


  onEditButtonClick = (urlId: string) => {
    this.props.history.push(`/urls/${urlId}/edit`)
  }

  onUrlCreate = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({saving: true})
    try {
      const newUrl = await createUrl(this.props.auth.getIdToken(), {
        url: this.state.url,
        description: this.state.description
      })
      this.setState({
        urls: [...this.state.urls, newUrl],
        url: '',
        description: '',
        saving: false
      })
    } catch {
      alert('Url creation failed')
    }
  }

  onUrlDelete = async (urlId: string) => {
    try {
      await deleteUrl(this.props.auth.getIdToken(), urlId)
      this.setState({
        urls: this.state.urls.filter(url => url.urlId != urlId)
      })
    } catch {
      alert('Url deletion failed')
    }
  }


  async componentDidMount() {
    try {
      const urls = await getUrls(this.props.auth.getIdToken())
      this.setState({
        urls,
        loadingUrls: false
      })
    } catch (e) {
      alert(`Failed to fetch urls: ${e.message}`)
    }
  }

  renderCreateUrlInput() {
    return (
      <Row>
        <Column>
          <Input
            fluid
            placeholder="http://everistus.me"
            onChange={this.handleNameChange}
          />
        </Column>

        <Column width={16}>
          <TextArea
          style={{ minHeight: 100, width: '100%', marginTop: '2rem', padding: '1rem'}}
            placeholder="Why I like this site"
            onChange={this.handleDescriptionChange}
          />
        </Column>

        <Column width={16}>
        {this.state.saving?  <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer> : 
          <Button onClick={this.onUrlCreate}> Create Record </Button> }
        </Column>
        <Column width={16}>
          <Divider />
        </Column>
      </Row>
    )
  }

  renderUrls() {
    if (this.state.loadingUrls) {
      return this.renderLoading()
    }

    return this.renderUrlsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading URLs
        </Loader>
      </Grid.Row>
    )
  }

  renderUrlsList() {
    return (
      <Grid padded>
        {this.state.urls.map((url, pos) => {
          return (
            <Grid.Row key={url.urlId}>
             
              <Grid.Column width={7} verticalAlign="middle">
                {url.url}
              </Grid.Column>
              <Grid.Column width={6} floated="right">
                {url.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(url.urlId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onUrlDelete(url.urlId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {url.attachmentUrl && (
                <Image src={url.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  render() {
    return (
      <div>
        <Header as="h1">My Favourite URLs</Header>

        {this.renderCreateUrlInput()}

        {this.renderUrls()}
      </div>
    )
  }

  

}
