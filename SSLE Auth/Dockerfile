#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["SSLE.Auth.api/Deploy/SSLE.Auth.Api.csproj", "SSLE.Auth.api/Deploy/"]
COPY ["SSLE.Auth.api/Business Services/SSLE.Auth.Services.Contract/SSLE.Auth.Services.Contract.csproj", "SSLE.Auth.api/Business Services/SSLE.Auth.Services.Contract/"]
COPY ["SSLE.Auth.api/Shared/SSLE..Auth.Common/SSLE.Auth.Common.csproj", "SSLE.Auth.api/Shared/SSLE..Auth.Common/"]
COPY ["SSLE.Auth.api/Business Services/SSLE.Auth.Services.Models/SSLE.Auth.Services.Models.csproj", "SSLE.Auth.api/Business Services/SSLE.Auth.Services.Models/"]
COPY ["SSLE.Auth.api/Business Services/SSLE.Auth.Services/SSLE.Auth.Services.csproj", "SSLE.Auth.api/Business Services/SSLE.Auth.Services/"]
COPY ["SSLE.Auth.api/Data Services/SSLE.Auth.Contract/SSLE.Auth.Repository.Contract.csproj", "SSLE.Auth.api/Data Services/SSLE.Auth.Contract/"]
COPY ["SSLE.Auth.api/Data Services/SSLE.Auth.Data.Contract/SSLE.Auth.Contract.csproj", "SSLE.Auth.api/Data Services/SSLE.Auth.Data.Contract/"]
COPY ["SSLE.Auth.api/Data Services/SSLE.Auth.Data/SSLE.Auth.Data.csproj", "SSLE.Auth.api/Data Services/SSLE.Auth.Data/"]
COPY ["SSLE.Auth.api/Data Services/SSLE.Auth.Data.Models/SSLE.Auth.Data.Models.csproj", "SSLE.Auth.api/Data Services/SSLE.Auth.Data.Models/"]
COPY ["SSLE.Auth.api/Shared/SSLE.Auth.Ioc/SSLE.Auth.Ioc.csproj", "SSLE.Auth.api/Shared/SSLE.Auth.Ioc/"]
COPY ["SSLE.Auth.api/Data Services/SSLE.Auth.Repository/SSLE.Auth.Repository.csproj", "SSLE.Auth.api/Data Services/SSLE.Auth.Repository/"]
RUN dotnet restore "SSLE.Auth.api/Deploy/SSLE.Auth.Api.csproj"
COPY . .
WORKDIR "/src/SSLE.Auth.api/Deploy"
RUN dotnet build "SSLE.Auth.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SSLE.Auth.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SSLE.Auth.Api.dll"]