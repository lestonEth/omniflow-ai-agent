import ActionNode from "@/components/custom-nodes/action-node"
import InputNode from "@/components/custom-nodes/input-node"
import OutputNode from "@/components/custom-nodes/output-node"
import ConditionNode from "@/components/custom-nodes/condition-node"
import ProcessingNode from "@/components/custom-nodes/processing-node"
import WhatsAppInputNode from "@/components/custom-nodes/whatsapp-input-node"
import WhatsAppOutputNode from "@/components/custom-nodes/whatsapp-output-node"

// Make sure we're exporting a plain object with component references
export const nodeTypes = {
  action: ActionNode,
  input: InputNode,
  output: OutputNode,
  condition: ConditionNode,
  processing: ProcessingNode,
  whatsapp_input: WhatsAppInputNode,
  whatsapp_output: WhatsAppOutputNode,
}

