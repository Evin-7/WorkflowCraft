export interface BlockDefinition {
  type: string;
  icon: string;
  color: string;
  defaultProps: Record<string, any>;
}

export interface WorkflowStep {
  id: number | string;
  type: string;
  props: Record<string, any>;
}

export type IconMap = Record<string, any>;

export const getIconComponent = (name: string, iconMap: IconMap) =>
  iconMap[name];

export const getBlockIcon = (
  type: string,
  blockDefinitions: BlockDefinition[],
) => blockDefinitions.find((b) => b.type === type)?.icon;

export const getBlockColor = (
  type: string,
  blockDefinitions: BlockDefinition[],
) => blockDefinitions.find((b) => b.type === type)?.color || "#0D7C66";

export const getStepDetail = (step: WorkflowStep): string => {
  const props = step.props || {};
  switch (step.type) {
    case "Wait":
      return `Duration: ${props.days || 0} day(s)`;
    case "Send Email":
      return `Subject: ${props.subject || "No Subject"}`;
    case "Send WhatsApp":
      return `Target: ${props.phone || "N/A"}`;
    case "Make API Call":
      return `${props.method || "GET"} to ${props.url || "N/A"}`;
    case "Conditional Split":
      return `Condition: ${props.condition || "N/A"}`;
    case "Update CRM":
      return `Set ${props.field || "N/A"} to ${props.value || "N/A"}`;
    default:
      return "";
  }
};

export const exportWorkflow = (workflow: WorkflowStep[]): string => {
  const cleanWorkflow = workflow.map((step) => ({
    type: step.type,
    props: step.props,
  }));
  return JSON.stringify({ workflow: cleanWorkflow }, null, 2);
};

export const copyToClipboard = (text: string) => {
  if (text) navigator.clipboard.writeText(text);
};
