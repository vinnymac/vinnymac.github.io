import React from 'react'
import { RouteHandler, Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import './style.css'
import '../../static/fonts/fontawesome/style.css'

class SiteLinks extends React.Component {
    render() {
      const twitter = config.siteTwitterUrl ? (<li>
        <a href={ config.siteTwitterUrl }>
          <i className='fa fa-twitter'></i>
        </a>
      </li>) : null

      const github = config.siteGithubUrl ? (<li>
        <a href={ config.siteGithubUrl }>
          <i className='fa fa-github-alt'></i>
        </a>
      </li>) : null

      const vk = config.siteVkUrl ? (<li>
        <a href={ config.siteVkUrl }>
          <i className='fa fa-vk'></i>
        </a>
      </li>) : null

      const email = config.siteEmailUrl ? (<li>
        <a href={ config.siteEmailUrl }>
          <i className='fa fa-envelope-o'></i>
        </a>
      </li>) : null

      const telegram = config.siteTelegramUrl ? (<li>
        <a href={ config.siteTelegramUrl }>
          <i className='fa fa-paper-plane'></i>
        </a>
      </li>) : null

      const rss = config.siteRssUrl ? (<li>
        <a href={ config.siteRssUrl }>
          <i className='fa fa-rss'></i>
        </a>
      </li>) : null

        return (
            <div className='blog-social'>
              <ul>
                {twitter}
                {github}
                {vk}
              </ul>
              <ul>
                {email}
                {telegram}
              </ul>
              <ul>
                {rss}
              </ul>
            </div>
            );
    }
}

export default SiteLinks
