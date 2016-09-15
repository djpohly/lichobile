import menu from '.';
import session from '../../session';
import loginModal from '../loginModal';
import newGameForm from '../newGameForm';
import gamesMenu from '../gamesMenu';
import friendsPopup from '../friendsPopup';
import challengeForm from '../challengeForm';
import playMachineForm from '../playMachineForm';
import i18n from '../../i18n';
import { handleXhrError, hasNetwork } from '../../utils';
import { getOfflineGames } from '../../utils/offlineGames';
import * as helper from '../helper';
import friendsApi from '../../lichess/friends';
import * as Zanimo from 'zanimo';

export default function view() {
  if (!menu.isOpen) return null;

  return (
    <aside id="side_menu" oncreate={slidesInUp}>
      {renderMenu()}
    </aside>
  );
}

function renderHeader(user) {
  return (
    <header className="side_menu_header">
      { session.isKidMode() ? <div className="kiddo">😊</div> : <div className="logo" /> }
      <h2 className="username">
        { hasNetwork() ? user ? user.username : 'Anonymous' : i18n('offline') }
      </h2>
      { hasNetwork() && user ?
        <button className="open_button" data-icon={menu.headerOpen() ? 'S' : 'R'}
          oncreate={helper.ontap(menu.toggleHeader, null, null, false)}
        /> : null
      }
      { hasNetwork() && !user ?
        <button className="login" oncreate={helper.ontapY(loginModal.open)}>
          {i18n('signIn')}
        </button> : null
      }
    </header>
  );
}

function renderProfileActions(user) {
  return (
    <ul className="side_links profileActions">
      <li className="side_link" oncreate={helper.ontap(menu.popup(friendsPopup.open))}>
        <span data-icon="f" />
        {i18n('onlineFriends') + ` (${friendsApi.count()})`}
      </li>
      <li className="side_link" oncreate={helper.ontap(menu.route(`/@/${user.id}/following`))}>
        <span className="fa fa-arrow-circle-right" />
        {i18n('nbFollowing', user.nbFollowing || 0)}
      </li>
      <li className="side_link" oncreate={helper.ontap(menu.route(`/@/${user.id}/followers`))}>
        <span className="fa fa-arrow-circle-left" />
        {i18n('nbFollowers', user.nbFollowers || 0)}
      </li>
      <li className="side_link" oncreate={helper.ontap(menu.route('/settings/preferences'))}>
        <span data-icon="%" />
        {i18n('preferences')}
      </li>
      <li className="side_link" oncreate={helper.ontap(() => {
        session.logout().catch(handleXhrError);
        menu.headerOpen(false);
      })}>
        <span data-icon="w" />
        {i18n('logOut')}
      </li>
    </ul>
  );
}

function renderLinks(user) {
  const offlineGames = getOfflineGames();

  return (
    <ul className="side_links">
      <li className="side_link" key="home" oncreate={helper.ontapY(menu.route('/'))}>
        <span className="fa fa-home" />Home
      </li>
      {hasNetwork() && user ?
      <li className="side_link" key="profile" oncreate={helper.ontap(menu.route('/@/' + user.id))}>
        <span className="fa fa-user" />{i18n('profile')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="sep_link" key="sep_link_online">{i18n('playOnline')}</li> : null
      }
      {hasNetwork() && session.nowPlaying().length ?
      <li className="side_link" key="current_games" oncreate={helper.ontapY(menu.popup(gamesMenu.open))}>
        <span className="menu_icon_game" />{i18n('nbGamesInPlay', session.nowPlaying().length)}
      </li> : null
      }
      {!hasNetwork() && offlineGames.length ?
      <li className="side_link" key="current_games" oncreate={helper.ontapY(menu.popup(gamesMenu.open))}>
        <span className="menu_icon_game" />{i18n('nbGamesInPlay', offlineGames.length)}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="play_real_time" oncreate={helper.ontapY(menu.popup(newGameForm.openRealTime))}>
        <span className="fa fa-plus-circle"/>{i18n('createAGame')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="invite_friend" oncreate={helper.ontapY(menu.popup(challengeForm.open))}>
        <span className="fa fa-share-alt"/>{i18n('playWithAFriend')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="play_online_ai" oncreate={helper.ontapY(menu.popup(playMachineForm.open))}>
        <span className="fa fa-cogs"/>{i18n('playWithTheMachine')}
      </li> : null
      }
      {hasNetwork() && user ?
      <li className="side_link" key="correspondence" oncreate={helper.ontapY(menu.route('/correspondence'))}>
        <span className="fa fa-paper-plane" />{i18n('correspondence')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="tv" oncreate={helper.ontapY(menu.route('/tv'))}>
        <span data-icon="1"/>{i18n('watchLichessTV')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="training" oncreate={helper.ontapY(menu.route('/training'))}>
        <span data-icon="-"/>{i18n('training')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="tournament" oncreate={helper.ontapY(menu.route('/tournament'))}>
        <span className="fa fa-trophy"/>{i18n('tournament')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="sep_link" key="sep_link_community">
        {i18n('community')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="players" oncreate={helper.ontapY(menu.route('/players'))}>
        <span className="fa fa-at"/>{i18n('players')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="ranking" oncreate={helper.ontapY(menu.route('/ranking'))}>
        <span className="fa fa-cubes"/>{i18n('leaderboard')}
      </li> : null
      }
      {hasNetwork() ?
      <li className="side_link" key="message" oncreate={helper.ontapY(menu.route('/inbox'))}>
        <span className="fa fa-inbox"/>{i18n('inbox')}
      </li> : null
      }
      <li className="sep_link" key="sep_link_offline">
        {i18n('playOffline')}
      </li>
      <li className="side_link" key="play_ai" oncreate={helper.ontapY(menu.route('/ai'))}>
        <span className="fa fa-cogs"/>{i18n('playOfflineComputer')}
      </li>
      <li className="side_link" key="play_otb" oncreate={helper.ontapY(menu.route('/otb'))}>
        <span className="fa fa-beer"/>{i18n('playOnTheBoardOffline')}
      </li>
      <li className="side_link" key="standalone_clock" oncreate={helper.ontapY(menu.route('/clock'))}>
        <span className="fa fa-clock-o"/>{i18n('clock')}
      </li>
      <li className="sep_link" key="sep_link_tools">{i18n('tools')}</li>
      <li className="side_link" key="analyse" oncreate={helper.ontapY(menu.route('/analyse'))}>
        <span data-icon="A" />{i18n('analysis')}
      </li>
      <li className="side_link" key="editor" oncreate={helper.ontapY(menu.route('/editor'))}>
        <span className="fa fa-pencil" />{i18n('boardEditor')}
      </li>
      <li className="hr" key="sep_link_settings"></li>
      <li className="side_link" key="settings" oncreate={helper.ontapY(menu.route('/settings'))}>
        <span className="fa fa-cog"/>{i18n('settings')}
      </li>
    </ul>
  );
}

function renderMenu() {
  const user = session.get();

  return (
    <div className="native_scroller">
      {renderHeader(user)}
      {user && menu.headerOpen() ? renderProfileActions(user) : renderLinks(user)}
    </div>
  );
}

function slidesInUp(vnode) {
  const el = vnode.dom;
  el.style.transform = 'translate3d(-100%,0,0)';
  // force reflow hack
  vnode.state.lol = el.offsetHeight;
  Zanimo(el, 'transform', 'translate3d(0,0,0)', 250, 'ease-out');
}
