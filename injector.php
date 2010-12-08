<?php
/**
 * @package midgardmvc_ui_create
 * @author The Midgard Project, http://www.midgard-project.org
 * @copyright The Midgard Project, http://www.midgard-project.org
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * Midgard MVC content editing system
 *
 * @package midgardmvc_ui_create
 */
class midgardmvc_ui_create_injector
{
    public function inject_process(midgardmvc_core_request $request)
    {
        // We inject the process only to register our own URL handlers
        $request->add_component_to_chain(midgardmvc_core::get_instance()->component->get('midgardmvc_ui_create'));

        if (!midgardmvc_core::get_instance()->authentication->is_user())
        {
            return;
        }

        if (midgardmvc_core::get_instance()->context->get_current_context() != 0)
        {
            return;
        }

        // TODO: Check that Aloha is enabled in session
        midgardmvc_core::get_instance()->head->enable_jquery();
        midgardmvc_core::get_instance()->head->add_jsfile(MIDGARDMVC_STATIC_URL . '/midgardmvc_ui_create/aloha.js');
    }
}
?>
