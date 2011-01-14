<?php
/**
 * @package midgardmvc_ui_create
 * @author The Midgard Project, http://www.midgard-project.org
 * @copyright The Midgard Project, http://www.midgard-project.org
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * Workflow definition for deleting objects
 *
 * @package midgardmvc_ui_create
 */
class midgardmvc_ui_create_workflow_delete implements midgardmvc_ui_create_workflow {

    public function can_handle(midgard_object $object)
    {
        if (midgardmvc_core::get_instance()->authorization->can_do('midgard:delete', $object))
        {
            return true;
        }
        return false;
    }

    public function run(midgard_object $object, array $args = null)
    {
        $workflow = new ezcWorkflow('delete');

        $getObject = new ezcWorkflowNodeInput
        (
            array
            (
                'object' => new ezcWorkflowConditionIsObject()
            )
        );
         
        $deleteObject = new ezcWorkflowNodeAction
        (
            array
            (
                'class' => 'midgardmvc_ui_create_workflow_action_delete'
            )
        );

        // Define steps
        $workflow->startNode->addoutNode($getObject);
        $getObject->addOutNode($deleteObject);
        $deleteObject->addoutNode($workflow->endNode);

        $execution = new midgardmvc_ui_create_workflow_execution($workflow);
        $execution->setVariable('object', $object);
        $execution->start();

        $values = array();
        if (!$execution->hasEnded())
        {
            $values['status'] = 'failure';
            $values['object'] = 'keep';
            return $values;
        }

        $values['status'] = 'ok';
        $values['object'] = 'remove';
        return $values;
    }
}
