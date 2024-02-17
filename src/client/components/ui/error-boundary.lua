local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local React =
	TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "react")

local ErrorBoundary = React.Component:extend("ErrorBoundary")

function ErrorBoundary:init()
	self:setState({
		hasError = false,
		message = nil,
	})
end

function ErrorBoundary:componentDidCatch(message, errorInfo)
	self:setState({
		hasError = true,
		message = `{message} {errorInfo.componentStack}`,
	})
end

function ErrorBoundary:render()
	if self.state.hasError then
		return self.props.fallback(self.state.message)
	else
		return self.props.children
	end
end

return {
	ErrorBoundary = ErrorBoundary,
}
